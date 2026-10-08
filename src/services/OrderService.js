export const OrderService = {
  name: "OrderService",
  handle(action, payload) { return { success: true, service: "OrderService", action, payload }; }
};
