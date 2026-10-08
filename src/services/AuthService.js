export const AuthService = {
  name: "AuthService",
  handle(action, payload) { return { success: true, service: "AuthService", action, payload }; }
};
