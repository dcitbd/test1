/**
 * DREAM CART BD — DATA VALIDATOR
 * Strict field validation, schema checks, phone & email sanitization.
 */

var Validator = {
  isValidBDPhone: function(phone) {
    if (!phone) return false;
    var cleaned = String(phone).replace(/[^0-9+]/g, "");
    // Handles 01XXXXXXXXX or +8801XXXXXXXXX or 8801XXXXXXXXX
    var regex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return regex.test(cleaned);
  },

  normalizeBDPhone: function(phone) {
    if (!phone) return "";
    var cleaned = String(phone).replace(/[^0-9]/g, "");
    if (cleaned.startsWith("8801")) {
      return cleaned.slice(2);
    }
    if (cleaned.startsWith("01")) {
      return cleaned;
    }
    return cleaned;
  },

  isValidEmail: function(email) {
    if (!email) return false;
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).trim().toLowerCase());
  },

  isPositiveNumber: function(val) {
    var num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  },

  validateOrderPayload: function(payload) {
    var errors = [];
    if (!payload) return { valid: false, errors: ["Missing order payload"] };
    
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push("Cart is empty or missing items.");
    } else {
      for (var i = 0; i < payload.items.length; i++) {
        var it = payload.items[i];
        if (!it.product_id && !it.sku) errors.push("Item at index " + i + " is missing product_id or sku.");
        if (!it.quantity || it.quantity < 1) errors.push("Item at index " + i + " has invalid quantity.");
        if (typeof it.price !== "number" || it.price < 0) errors.push("Item at index " + i + " has invalid price.");
      }
    }

    if (!payload.customer_name || String(payload.customer_name).trim().length < 2) {
      errors.push("Customer name is required (min 2 characters).");
    }

    if (!this.isValidBDPhone(payload.customer_phone)) {
      errors.push("Valid 11-digit Bangladesh phone number is required (e.g. 017XXXXXXXX).");
    }

    if (!payload.shipping_address || String(payload.shipping_address).trim().length < 5) {
      errors.push("Valid shipping delivery address is required.");
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  sanitizeString: function(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[<>]/g, "").trim();
  }
};

if (typeof module !== 'undefined') {
  module.exports = Validator;
}
