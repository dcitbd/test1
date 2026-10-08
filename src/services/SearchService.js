export const SearchService = {
  name: "SearchService",
  handle(action, payload) { return { success: true, service: "SearchService", action, payload }; }
};
