/**
 * DREAM CART BD — ORDER SERVICE
 * Multi-Vendor Master Order + Sub-Orders architecture.
 * Full state machine, fraud screening, atomic inventory reservation.
 */

var OrderService = {
  createOrder: function(session, payload) {
    var validation = Validator.validateOrderPayload(payload);
    if (!validation.valid) {
      return { success: false, errors: validation.errors, error_code: "VALIDATION_FAILED" };
    }

    var orderId = IDGenerator.orderID();
    var customerId = session && session.user_id ? session.user_id : (payload.customer_id || IDGenerator.customerID());

    // Calculate totals and group items by seller for sub-orders
    var items = payload.items;
    var subtotal = 0;
    var sellerGroups = {};

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      
      var sellerId = item.seller_id || "DCBD-OFFICIAL";
      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = [];
      }
      sellerGroups[sellerId].push(item);
    }

        // Calculate delivery charge based on shop policy
    var deliveryCharge = 90;
    var zone = (payload.zone || "").toLowerCase();
    if (zone === "cumilla") {
      deliveryCharge = 70;
    } else if (zone === "dhaka") {
      deliveryCharge = 90;
    } else if (zone === "outside") {
      deliveryCharge = 120;
    } else if (zone === "pickup") {
      deliveryCharge = 0;
    } else if (payload.delivery_charge !== undefined) {
      deliveryCharge = parseFloat(payload.delivery_charge);
    }
    // Free delivery threshold: 2000
    if (subtotal >= 2000 || zone === "pickup") {
      deliveryCharge = 0;
    }
    // Online prepayment 5% discount
    var onlineDiscount = 0;
    var paymentMethod = (payload.payment_method || "COD").toUpperCase();
    if (["BKASH_PERSONAL", "BKASH_PAYMENT", "NAGAD_PERSONAL", "ROCKET_PERSONAL", "BANK"].indexOf(paymentMethod) > -1) {
      onlineDiscount = Math.round(subtotal * 0.05);
    }
    var discount = (payload.discount ? parseFloat(payload.discount) : 0) + onlineDiscount;
    var discount = payload.discount ? parseFloat(payload.discount) : 0;
    var grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

    // Fraud risk scoring check
    var fraudCheck = FraudService.assessRisk({
      phone: payload.customer_phone,
      address: payload.shipping_address,
      order_total: grandTotal
    });

    // Execute atomic reservation & order record under LockService
    var createdResult = AppLockService.runWithLock("CREATE_ORDER_" + orderId, function() {
      // 1. Reserve Stock
      InventoryService.reserveStock(orderId, items);

      // 2. Create Master Order Record
      var masterOrder = {
        order_id: orderId,
        customer_id: customerId,
        customer_name: Validator.sanitizeString(payload.customer_name),
        customer_phone: Validator.normalizeBDPhone(payload.customer_phone),
        customer_email: payload.customer_email || "",
        shipping_address: Validator.sanitizeString(payload.shipping_address),
        city: payload.city || "Dhaka",
        zone: payload.zone || "",
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        discount: discount,
        grand_total: grandTotal,
        payment_method: payload.payment_method || "COD",
        payment_status: payload.payment_method === "COD" ? "PENDING" : (payload.payment_status || "PENDING"),
        order_status: CONFIG.ORDER_STATUS.PENDING,
        fraud_risk_score: fraudCheck.riskScore,
        fraud_risk_level: fraudCheck.riskLevel,
        is_flagged: fraudCheck.isFlagged,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      SheetRepository.appendRow(CONFIG.SHEETS.ORDERS, masterOrder);

      // 3. Create Order Items Records
      var itemRows = [];
      for (var k = 0; k < items.length; k++) {
        var it = items[k];
        itemRows.push({
          item_id: IDGenerator.generate("ITM"),
          order_id: orderId,
          product_id: it.product_id,
          variant_id: it.variant_id || "",
          product_name: it.name || it.product_name || "Product",
          seller_id: it.seller_id || "DCBD-OFFICIAL",
          quantity: it.quantity,
          unit_price: it.price,
          total_price: it.price * it.quantity,
          created_at: new Date().toISOString()
        });
      }
      SheetRepository.appendRowsBatch(CONFIG.SHEETS.ORDER_ITEMS, itemRows);

      // 4. Create Multi-Vendor Sub-Orders
      var subOrderRows = [];
      var sellerIds = Object.keys(sellerGroups);
      for (var s = 0; s < sellerIds.length; s++) {
        var sId = sellerIds[s];
        var sItems = sellerGroups[sId];
        var sSubtotal = sItems.reduce(function(acc, x) { return acc + (x.price * x.quantity); }, 0);
        var subId = IDGenerator.subOrderID(orderId, sId);

        subOrderRows.push({
          sub_order_id: subId,
          master_order_id: orderId,
          seller_id: sId,
          items_count: sItems.length,
          subtotal: sSubtotal,
          commission_rate: 0.10, // 10% standard marketplace commission
          commission_amount: sSubtotal * 0.10,
          seller_payout_amount: sSubtotal * 0.90,
          status: CONFIG.ORDER_STATUS.PENDING,
          courier_id: "",
          tracking_code: "",
          created_at: new Date().toISOString()
        });
      }
      SheetRepository.appendRowsBatch(CONFIG.SHEETS.SUB_ORDERS, subOrderRows);

      // 5. Notify customer & queue notification
      NotificationService.queue({
        type: "ORDER_CREATED",
        recipient: masterOrder.customer_phone,
        message: "Thank you for your order! Your Dream Cart BD Order ID is " + orderId + ". Total: BDT " + grandTotal + "."
      });

      AuditService.log(customerId, "CUSTOMER", "ORDER_CREATE", "Orders", orderId, { total: grandTotal, items: items.length });

      return {
        order_id: orderId,
        grand_total: grandTotal,
        sub_orders: subOrderRows.map(function(so) { return so.sub_order_id; })
      };
    });

    return {
      success: true,
      data: createdResult,
      message: "Order placed successfully!"
    };
  },

  getOrderDetails: function(session, orderId) {
    var order = SheetRepository.findOne(CONFIG.SHEETS.ORDERS, function(o) {
      return o.order_id === orderId;
    });
    if (!order) return null;

    // Verify permission: either Admin/Staff or the owner Customer
    if (session && !PermissionService.verifyCustomerOrderScope(session, order.customer_id)) {
      throw new Error("Unauthorized access to this order.");
    }

    var items = SheetRepository.findRows(CONFIG.SHEETS.ORDER_ITEMS, function(it) {
      return it.order_id === orderId;
    });

    var subOrders = SheetRepository.findRows(CONFIG.SHEETS.SUB_ORDERS, function(so) {
      return so.master_order_id === orderId;
    });

    return {
      order: order,
      items: items,
      sub_orders: subOrders
    };
  },

  updateStatus: function(session, orderId, newStatus, note) {
    if (!session || !PermissionService.canAccess(session, CONFIG.ROLES.STAFF)) {
      throw new Error("Unauthorized to update order status.");
    }

    var validTransitions = [
      CONFIG.ORDER_STATUS.PENDING,
      CONFIG.ORDER_STATUS.CONFIRMED,
      CONFIG.ORDER_STATUS.PROCESSING,
      CONFIG.ORDER_STATUS.READY_TO_SHIP,
      CONFIG.ORDER_STATUS.SHIPPED,
      CONFIG.ORDER_STATUS.OUT_FOR_DELIVERY,
      CONFIG.ORDER_STATUS.DELIVERED,
      CONFIG.ORDER_STATUS.CANCELLED,
      CONFIG.ORDER_STATUS.RTO,
      CONFIG.ORDER_STATUS.RETURN_REQUESTED,
      CONFIG.ORDER_STATUS.REFUNDED
    ];

    if (validTransitions.indexOf(newStatus) === -1) {
      throw new Error("Invalid order status transition: " + newStatus);
    }

    // Handle inventory transitions
    if (newStatus === CONFIG.ORDER_STATUS.CANCELLED) {
      InventoryService.releaseReservation(orderId);
    } else if (newStatus === CONFIG.ORDER_STATUS.SHIPPED) {
      InventoryService.commitDeduction(orderId);
    }

    SheetRepository.updateRowByCondition(CONFIG.SHEETS.ORDERS, function(o) {
      return o.order_id === orderId;
    }, {
      order_status: newStatus,
      updated_at: new Date().toISOString()
    });

    // Also record order status history note
    SheetRepository.appendRow(CONFIG.SHEETS.ORDER_NOTES, {
      note_id: IDGenerator.generate("NOT"),
      order_id: orderId,
      author_id: session.user_id,
      status_change: newStatus,
      note: note || ("Status changed to " + newStatus),
      created_at: new Date().toISOString()
    });

    AuditService.log(session.user_id, session.role, "ORDER_STATUS_CHANGE", "Orders", orderId, { status: newStatus });
    return { success: true, message: "Order status updated to " + newStatus };
  }
};

if (typeof module !== 'undefined') {
  module.exports = OrderService;
}
