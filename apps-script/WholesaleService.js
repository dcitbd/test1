var WholesaleService = {
  getCatalog: function() {
    return SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCTS).filter(function(p) { return p.status === "active"; }).map(function(p) {
      return { product_id: p.product_id, name: p.product_name, wholesale_price: parseFloat(p.wholesale_price) || 0, moq: parseInt(p.wholesale_moq, 10) || 5 };
    });
  }
};
if (typeof module !== 'undefined') module.exports = WholesaleService;
