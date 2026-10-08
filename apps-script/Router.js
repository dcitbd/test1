/**
 * DREAM CART BD — API ROUTER & DISPATCHER
 * Maps actions, verifies sessions, enforces RBAC, returns standardized JSON envelope.
 */

var Router = {
  dispatch: function(action, payload, sessionToken, metadata) {
    var requestId = IDGenerator.generate("REQ");
    var startTime = Date.now();
    var session = sessionToken ? SessionService.getSession(sessionToken) : null;

    try {
      var result = null;

      switch (action) {
        // --- AUTHENTICATION ---
        case "auth/login":
          result = AuthService.login(payload.identifier || payload.phone, payload.password, metadata);
          break;
        case "auth/register":
          result = AuthService.registerCustomer(payload);
          break;
        case "auth/me":
          if (!session) throw new Error("Unauthorized: Invalid or expired session");
          result = { success: true, user: session };
          break;
        case "auth/logout":
          SessionService.destroySession(sessionToken);
          result = { success: true, message: "Logged out successfully." };
          break;

        // --- CATALOG & PRODUCTS ---
        case "products/list":
          result = { success: true, data: ProductService.getPublicProducts(payload) };
          break;
        case "products/details":
          var details = ProductService.getProductDetails(payload.id || payload.slug);
          if (!details) {
            return this.buildResponse(false, null, "Product not found", "NOT_FOUND", requestId, 404);
          }
          result = { success: true, data: details };
          break;
        case "products/create":
          result = ProductService.createProduct(session, payload);
          break;

        // --- ORDERS & CHECKOUT ---
        case "orders/create":
          result = OrderService.createOrder(session, payload);
          break;
        case "orders/details":
          var orderData = OrderService.getOrderDetails(session, payload.order_id);
          if (!orderData) {
            return this.buildResponse(false, null, "Order not found", "NOT_FOUND", requestId, 404);
          }
          result = { success: true, data: orderData };
          break;
        case "orders/update_status":
          result = OrderService.updateStatus(session, payload.order_id, payload.status, payload.note);
          break;

        // --- INVENTORY & STOCK ---
        case "inventory/check":
          result = { success: true, data: InventoryService.checkAvailability(payload.product_id, payload.variant_id, payload.quantity || 1) };
          break;

        // --- FRAUD & COURIER ---
        case "fraud/check_phone":
          result = { success: true, data: FraudService.checkPhoneAcrossCouriers(payload.phone) };
          break;
        case "couriers/create_consignment":
          result = CourierService.createConsignment(payload.order_id, payload.courier);
          break;

        // --- MARKETING & COUPONS ---
        case "coupons/validate":
          result = { success: true, data: CouponService.validateCoupon(payload.code, payload.subtotal, session ? session.user_id : null) };
          break;

        // --- PARTNERS (SELLER, RESELLER, WHOLESALE) ---
        case "seller/apply":
          result = SellerService.applyForSeller(session, payload);
          break;
        case "seller/approve":
          result = SellerService.approveSeller(session, payload.application_id);
          break;
        case "seller/dashboard":
          if (!session || session.role !== CONFIG.ROLES.SELLER) throw new Error("Unauthorized seller portal access");
          result = { success: true, data: SellerService.getSellerDashboardData(session) };
          break;
        case "reseller/catalog":
          result = { success: true, data: ResellerService.getResellerCatalog(session) };
          break;
        case "wholesale/catalog":
          result = { success: true, data: WholesaleService.getWholesaleCatalog(session) };
          break;

        // --- ADMIN REPORTS & BACKUP ---
        case "admin/kpi":
          if (!session || !PermissionService.canAccess(session, CONFIG.ROLES.STAFF)) throw new Error("Unauthorized");
          result = { success: true, data: ReportService.getAdminKPISummary() };
          break;
        case "admin/backup":
          result = BackupService.createSnapshot(session);
          break;

        // --- SYSTEM HEALTH & TEST ---
        case "system/health":
          result = {
            success: true,
            data: {
              status: "UP",
              app: CONFIG.APP_NAME,
              version: CONFIG.VERSION,
              time: new Date().toISOString()
            }
          };
          break;

        default:
          return this.buildResponse(false, null, "Unknown API action: " + action, "UNKNOWN_ACTION", requestId, 404);
      }

      var duration = Date.now() - startTime;
      AuditService.logAPI(action, "POST/GET", 200, duration, null, requestId);
      return this.buildResponse(result.success !== false, result.data !== undefined ? result.data : result, result.message || "Operation successful", result.error_code || null, requestId, 200);

    } catch (err) {
      var durationErr = Date.now() - startTime;
      var errMsg = err.message || err.toString();
      AuditService.logAPI(action, "ERROR", 500, durationErr, errMsg, requestId);
      return this.buildResponse(false, null, errMsg, "INTERNAL_ERROR", requestId, 500);
    }
  },

  buildResponse: function(success, data, message, errorCode, requestId, statusCode) {
    return {
      success: success,
      data: data,
      message: message,
      error_code: errorCode,
      request_id: requestId,
      status_code: statusCode || (success ? 200 : 400),
      timestamp: new Date().toISOString()
    };
  }
};

if (typeof module !== 'undefined') {
  module.exports = Router;
}
