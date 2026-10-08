var SellerService = {
  apply: function(session, data) {
    var id = IDGenerator.generate("APP");
    var rec = { application_id: id, user_id: session ? session.user_id : IDGenerator.generate("USR"), store_name: Validator.sanitizeString(data.store_name), phone: Validator.normalizeBDPhone(data.phone), status: CONFIG.SELLER_STATUS.PENDING, created_at: new Date().toISOString() };
    SheetRepository.appendRow(CONFIG.SHEETS.SELLER_APPLICATIONS, rec);
    return { success: true, application_id: id };
  },
  getDashboard: function(session) {
    var sId = session.seller_id || session.user_id;
    var subOrders = SheetRepository.findRows(CONFIG.SHEETS.SUB_ORDERS, function(o) { return o.seller_id === sId; });
    return { seller_id: sId, sub_orders: subOrders };
  }
};
if (typeof module !== 'undefined') module.exports = SellerService;
