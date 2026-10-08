/**
 * DREAM CART BD — AUDIT & LOGGING SERVICE
 * Immutable tracking of all privileged actions, API requests, and webhooks.
 */

var AuditService = {
  log: function(actorId, actorRole, action, entity, entityId, details, ip) {
    try {
      var logEntry = {
        log_id: IDGenerator.logID(),
        timestamp: new Date().toISOString(),
        actor_id: actorId || "SYSTEM",
        actor_role: actorRole || "GUEST",
        action: action,
        entity: entity,
        entity_id: entityId || "",
        details: typeof details === "object" ? JSON.stringify(details) : String(details || ""),
        ip_address: ip || "0.0.0.0"
      };
      SheetRepository.appendRow(CONFIG.SHEETS.ACTIVITY_LOGS, logEntry);
    } catch (e) {
      Logger.log("AuditService Error: " + e.message);
    }
  },

  logAPI: function(endpoint, method, statusCode, durationMs, errorMsg, requestId) {
    try {
      var entry = {
        request_id: requestId || IDGenerator.generate("REQ"),
        timestamp: new Date().toISOString(),
        endpoint: endpoint,
        method: method,
        status_code: statusCode,
        duration_ms: durationMs,
        error_message: errorMsg || "",
      };
      SheetRepository.appendRow(CONFIG.SHEETS.API_LOGS, entry);
    } catch (e) {}
  }
};

if (typeof module !== 'undefined') {
  module.exports = AuditService;
}
