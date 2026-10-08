var CourierService = {
  createConsignment: function(orderId, courier) {
    courier = courier || "STEADFAST";
    var trk = "DCBD-" + courier.slice(0, 2) + "-" + Math.floor(100000 + Math.random() * 900000);
    SheetRepository.updateRowByCondition(CONFIG.SHEETS.ORDERS, function(o) { return o.order_id === orderId; }, { courier_id: courier, tracking_code: trk, order_status: CONFIG.ORDER_STATUS.READY_TO_SHIP });
    return { success: true, courier: courier, tracking_code: trk };
  }
};
if (typeof module !== 'undefined') module.exports = CourierService;
