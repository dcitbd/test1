var ReviewService = {
  addReview: function(pId, rating, comment, name) {
    SheetRepository.appendRow(CONFIG.SHEETS.REVIEWS, { review_id: IDGenerator.generate("REV"), product_id: pId, customer_name: name, rating: rating, comment: comment, created_at: new Date().toISOString() });
    return { success: true };
  }
};
if (typeof module !== 'undefined') module.exports = ReviewService;
