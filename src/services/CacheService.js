export const CacheService = {
  name: "CacheService",
  handle(action, payload) { return { success: true, service: "CacheService", action, payload }; }
};
