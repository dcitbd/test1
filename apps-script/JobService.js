var JobService = {
  enqueue: function(type, payload) {
    var jId = IDGenerator.jobID();
    SheetRepository.appendRow(CONFIG.SHEETS.BACKGROUND_JOBS, { job_id: jId, type: type, payload: JSON.stringify(payload || {}), status: "QUEUED", created_at: new Date().toISOString() });
    return jId;
  }
};
if (typeof module !== 'undefined') module.exports = JobService;
