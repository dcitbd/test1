var CustomerService = {
  getProfile: function(cId) { return SheetRepository.findOne(CONFIG.SHEETS.USERS, function(u) { return u.user_id === cId; }); },
  getOrders: function(cId) { return SheetRepository.findRows(CONFIG.SHEETS.ORDERS, function(o) { return o.customer_id === cId; }); }
};
if (typeof module !== 'undefined') module.exports = CustomerService;
