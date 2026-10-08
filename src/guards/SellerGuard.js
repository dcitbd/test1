import { authStore } from '../store/authStore.js';

export function SellerGuard(requiredRole) {
  if (!authStore.isAuthenticated()) return false;
  if (requiredRole && authStore.user?.role !== requiredRole) return false;
  return true;
}
