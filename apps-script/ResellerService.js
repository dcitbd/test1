var ResellerService = {
  getCatalog: function() {
    return SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCTS).filter(function(p) { return p.status === "active"; }).map(function(p) {
      var retail = parseFloat(p.selling_price) || 0;
      var rsl = parseFloat(p.reseller_price) || (retail * 0.9);
      return { product_id: p.product_id, name: p.product_name, retail_price: retail, reseller_price: rsl, margin: retail - rsl };
    });
  }
};
if (typeof module !== 'undefined') module.exports = ResellerService;
