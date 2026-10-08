var SearchService = {
  search: function(q) {
    var prods = SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCTS);
    q = String(q || '').toLowerCase();
    return prods.filter(function(p) { return String(p.product_name || '').toLowerCase().includes(q) || String(p.sku || '').toLowerCase().includes(q); });
  }
};
if (typeof module !== 'undefined') module.exports = SearchService;
