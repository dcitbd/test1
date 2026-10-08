/**
 * DREAM CART BD — ATOMIC ID GENERATOR
 * Standardized, collision-free, human-readable identifier generator.
 */

var IDGenerator = {
  generate: function(prefix) {
    prefix = prefix ? prefix.toUpperCase() : "GEN";
    var now = new Date();
    var y = now.getFullYear().toString().slice(-2);
    var m = ("0" + (now.getMonth() + 1)).slice(-2);
    var d = ("0" + now.getDate()).slice(-2);
    var randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    var timePart = now.getTime().toString().slice(-4);
    return prefix + "-" + y + m + d + "-" + timePart + randomPart;
  },

  productID: function() {
    return this.generate("PRD");
  },

  variantID: function(productID, index) {
    return (productID || this.productID()) + "-V" + (index !== undefined ? ("0" + index).slice(-2) : Math.floor(10 + Math.random() * 90));
  },

  orderID: function() {
    return this.generate("ORD");
  },

  subOrderID: function(masterOrderID, sellerCode) {
    var code = (sellerCode || "S1").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
    return masterOrderID + "-" + code;
  },

  customerID: function() {
    return this.generate("CST");
  },

  sellerID: function() {
    return this.generate("VND");
  },

  resellerID: function() {
    return this.generate("RSL");
  },

  wholesaleID: function() {
    return this.generate("WHL");
  },

  paymentID: function() {
    return this.generate("PAY");
  },

  transactionID: function() {
    return this.generate("TXN");
  },

  jobID: function() {
    return this.generate("JOB");
  },

  logID: function() {
    return this.generate("LOG");
  },

  token: function() {
    var uuid = Utilities.getUuid().replace(/-/g, "");
    var time = (new Date()).getTime().toString(36);
    return "dcbd_" + time + "_" + uuid;
  }
};

if (typeof module !== 'undefined') {
  module.exports = IDGenerator;
}
