export const CheckoutService = {
  name: "CheckoutService",
  handle(action, payload) { return { success: true, service: "CheckoutService", action, payload }; }
};
