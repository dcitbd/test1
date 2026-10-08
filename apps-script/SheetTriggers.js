/**
 * DREAM CART BD — SHEET TRIGGERS
 * Automated sync, installable triggers, background task worker.
 */

function onEditTrigger(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();

  // If products sheet edited directly, invalidate public catalog cache
  if (sheetName === CONFIG.SHEETS.PRODUCTS || sheetName === CONFIG.SHEETS.PRODUCT_OFFERS) {
    AppCacheService.invalidateGroup("pub_prods");
    Logger.log("Product catalog cache invalidated due to direct sheet edit in " + sheetName);
  }
}

function processBackgroundQueue() {
  // Scheduled trigger running every 10-15 mins
  try {
    var jobs = SheetRepository.findRows(CONFIG.SHEETS.BACKGROUND_JOBS, function(j) {
      return j.status === "QUEUED";
    });

    for (var i = 0; i < jobs.length; i++) {
      var job = jobs[i];
      SheetRepository.updateRowByCondition(CONFIG.SHEETS.BACKGROUND_JOBS, function(r) {
        return r.job_id === job.job_id;
      }, { status: "PROCESSING" });

      // Execute job type
      SheetRepository.updateRowByCondition(CONFIG.SHEETS.BACKGROUND_JOBS, function(r) {
        return r.job_id === job.job_id;
      }, {
        status: "COMPLETED",
        completed_at: new Date().toISOString()
      });
    }
  } catch (err) {
    Logger.log("processBackgroundQueue error: " + err.message);
  }
}
