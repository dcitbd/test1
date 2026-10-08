/**
 * DREAM CART BD — INVENTORY SERVICE
 * 4-Tier Stock System: AVAILABLE = PHYSICAL - RESERVED - DAMAGED.
 * Atomic stock reservations, concurrency locks, stock movements.
 */

var InventoryService = {
  checkAvailability: function(productId, variantId, requestedQty) {
    var p = SheetRepository.findOne(CONFIG.SHEETS.PRODUCTS, function(row) {
      return row.product_id === productId;
    });
    if (!p) return { available: false, current_stock: 0 };

    var avail = parseInt(p.available_stock, 10) || 0;
    return {
      available: avail >= requestedQty,
      current_stock: avail
    };
  },

  reserveStock: function(orderId, items) {
    return AppLockService.runWithLock("STOCK_RESERVE_" + orderId, function() {
      // 1. Verify all items have enough stock first
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var p = SheetRepository.findOne(CONFIG.SHEETS.PRODUCTS, function(row) {
          return row.product_id === it.product_id;
        });
        if (!p) throw new Error("Product not found: " + it.product_id);
        var currentAvail = parseInt(p.available_stock, 10) || 0;
        if (currentAvail < it.quantity) {
          throw new Error("Insufficient stock for product: " + (p.product_name || it.product_id) + ". Available: " + currentAvail + ", Requested: " + it.quantity);
        }
      }

      // 2. Perform atomic reservation
      var reservations = [];
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var reserveId = IDGenerator.generate("RES");
        
        SheetRepository.updateRowByCondition(CONFIG.SHEETS.PRODUCTS, function(r) {
          return r.product_id === item.product_id;
        }, {
          available_stock: parseInt(p.available_stock, 10) - item.quantity,
          reserved_stock: (parseInt(p.reserved_stock, 10) || 0) + item.quantity
        });

        reservations.push({
          reservation_id: reserveId,
          order_id: orderId,
          product_id: item.product_id,
          variant_id: item.variant_id || "",
          quantity: item.quantity,
          status: "RESERVED",
          created_at: new Date().toISOString()
        });
      }

      SheetRepository.appendRowsBatch(CONFIG.SHEETS.STOCK_RESERVATIONS, reservations);
      AppCacheService.invalidateGroup("pub_prods");
      return true;
    });
  },

  releaseReservation: function(orderId) {
    return AppLockService.runWithLock("STOCK_RELEASE_" + orderId, function() {
      var reservations = SheetRepository.findRows(CONFIG.SHEETS.STOCK_RESERVATIONS, function(r) {
        return r.order_id === orderId && r.status === "RESERVED";
      });

      for (var i = 0; i < reservations.length; i++) {
        var res = reservations[i];
        var p = SheetRepository.findOne(CONFIG.SHEETS.PRODUCTS, function(row) {
          return row.product_id === res.product_id;
        });
        if (p) {
          SheetRepository.updateRowByCondition(CONFIG.SHEETS.PRODUCTS, function(row) {
            return row.product_id === res.product_id;
          }, {
            available_stock: (parseInt(p.available_stock, 10) || 0) + parseInt(res.quantity, 10),
            reserved_stock: Math.max(0, (parseInt(p.reserved_stock, 10) || 0) - parseInt(res.quantity, 10))
          });
        }
      }

      SheetRepository.updateRowByCondition(CONFIG.SHEETS.STOCK_RESERVATIONS, function(r) {
        return r.order_id === orderId && r.status === "RESERVED";
      }, { status: "RELEASED" });

      AppCacheService.invalidateGroup("pub_prods");
      return true;
    });
  },

  commitDeduction: function(orderId) {
    // When order is shipped: physical stock is deducted and reserved stock cleared
    return AppLockService.runWithLock("STOCK_COMMIT_" + orderId, function() {
      var reservations = SheetRepository.findRows(CONFIG.SHEETS.STOCK_RESERVATIONS, function(r) {
        return r.order_id === orderId && r.status === "RESERVED";
      });

      for (var i = 0; i < reservations.length; i++) {
        var res = reservations[i];
        var p = SheetRepository.findOne(CONFIG.SHEETS.PRODUCTS, function(row) {
          return row.product_id === res.product_id;
        });
        if (p) {
          SheetRepository.updateRowByCondition(CONFIG.SHEETS.PRODUCTS, function(row) {
            return row.product_id === res.product_id;
          }, {
            physical_stock: Math.max(0, (parseInt(p.physical_stock, 10) || 0) - parseInt(res.quantity, 10)),
            reserved_stock: Math.max(0, (parseInt(p.reserved_stock, 10) || 0) - parseInt(res.quantity, 10))
          });
        }
      }

      SheetRepository.updateRowByCondition(CONFIG.SHEETS.STOCK_RESERVATIONS, function(r) {
        return r.order_id === orderId && r.status === "RESERVED";
      }, { status: "COMMITTED" });

      AppCacheService.invalidateGroup("pub_prods");
      return true;
    });
  }
};

if (typeof module !== 'undefined') {
  module.exports = InventoryService;
}
