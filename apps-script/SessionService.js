var SessionService = {
  createSession: function(userId, role, meta) {
    var token = IDGenerator.token();
    var exp = new Date(Date.now() + CONFIG.SESSION_TTL_HOURS * 3600 * 1000).toISOString();
    var rec = { token: token, user_id: userId, role: role, created_at: new Date().toISOString(), expires_at: exp, is_active: true };
    SheetRepository.appendRow(CONFIG.SHEETS.SESSIONS, rec);
    AppCacheService.set("sess_" + token, rec, 1800);
    return { token: token, expires_at: exp };
  },
  getSession: function(token) {
    if (!token) return null;
    var cached = AppCacheService.get("sess_" + token);
    if (cached && new Date(cached.expires_at) > new Date() && cached.is_active) return cached;
    var row = SheetRepository.findOne(CONFIG.SHEETS.SESSIONS, function(r) { return r.token === token && String(r.is_active).toLowerCase() === "true"; });
    if (row && new Date(row.expires_at) > new Date()) {
      AppCacheService.set("sess_" + token, row, 1800);
      return row;
    }
    return null;
  },
  destroySession: function(token) {
    AppCacheService.remove("sess_" + token);
    return SheetRepository.updateRowByCondition(CONFIG.SHEETS.SESSIONS, function(r) { return r.token === token; }, { is_active: false });
  }
};
if (typeof module !== 'undefined') module.exports = SessionService;
