/**
 * DREAM CART BD — CACHE SERVICE
 * In-memory & CacheService caching with scoped invalidation.
 */

var AppCacheService = {
  get: function(key) {
    try {
      var cache = CacheService.getScriptCache();
      var cached = cache.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}
    return null;
  },

  set: function(key, data, ttlSeconds) {
    try {
      var cache = CacheService.getScriptCache();
      var str = JSON.stringify(data);
      // CacheService entry limit is 100KB per key
      if (str.length < 95000) {
        cache.put(key, str, ttlSeconds || CONFIG.CACHE_TTL_SECONDS);
      }
    } catch (e) {}
  },

  remove: function(key) {
    try {
      CacheService.getScriptCache().remove(key);
    } catch (e) {}
  },

  invalidateGroup: function(groupPrefix) {
    // Helper to invalidate known group keys
    var standardKeys = [
      groupPrefix + "_list",
      groupPrefix + "_categories",
      groupPrefix + "_featured",
      groupPrefix + "_summary"
    ];
    try {
      CacheService.getScriptCache().removeAll(standardKeys);
    } catch (e) {}
  }
};

if (typeof module !== 'undefined') {
  module.exports = AppCacheService;
}
