var ReportService = {
  getKPI: function() {
    return { today_sales: 42850, today_orders: 18, total_sales: 1284500, total_orders: 684, pending_orders: 7, delivered_orders: 590, rto_orders: 22, low_stock_count: 3, total_products: 48, active_sellers: 12 };
  }
};
if (typeof module !== 'undefined') module.exports = ReportService;
