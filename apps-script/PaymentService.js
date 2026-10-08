var PaymentService = {
  recordPayment: function(orderId, method, amt, trx) {
    var pId = IDGenerator.paymentID();
    SheetRepository.appendRow(CONFIG.SHEETS.PAYMENTS, { payment_id: pId, order_id: orderId, method: method, amount: amt, transaction_id: trx, status: method === "COD" ? "PENDING" : "VERIFIED", created_at: new Date().toISOString() });
    return { success: true, payment_id: pId };
  }
};
if (typeof module !== 'undefined') module.exports = PaymentService;
