export const InventoryService = {
  name: "InventoryService",
  handle(action, payload) { return { success: true, service: "InventoryService", action, payload }; }
};
