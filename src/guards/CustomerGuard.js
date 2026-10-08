import { authStore } from '../store/authStore.js';

export function CustomerGuard(requiredRole) {
  if (!authStore.isAuthenticated()) return false;
  if (requiredRole && authStore.user?.role !== requiredRole) return false;
  return true;
}
