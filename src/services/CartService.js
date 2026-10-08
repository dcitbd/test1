export const CartService = {
  name: "CartService",
  handle(action, payload) { return { success: true, service: "CartService", action, payload }; }
};
