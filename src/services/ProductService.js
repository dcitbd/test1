export const ProductService = {
  name: "ProductService",
  handle(action, payload) { return { success: true, service: "ProductService", action, payload }; }
};
