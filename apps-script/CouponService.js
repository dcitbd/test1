var CouponService = {
  validate: function(code, subtotal) {
    if (String(code || '').toUpperCase().trim() === 'DREAM10') {
      return { valid: true, code: 'DREAM10', discount_amount: Math.round(subtotal * 0.1) };
    }
    return { valid: false, message: 'Invalid coupon' };
  }
};
if (typeof module !== 'undefined') module.exports = CouponService;
