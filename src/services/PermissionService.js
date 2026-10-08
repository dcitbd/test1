export const PermissionService = {
  name: "PermissionService",
  handle(action, payload) { return { success: true, service: "PermissionService", action, payload }; }
};
