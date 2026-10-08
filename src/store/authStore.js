/**
 * DREAM CART BD — AUTH STORE
 * Manages authenticated user session across Customer, Reseller, Wholesaler, and Admin/Worker accounts.
 */

class AuthStore {
  constructor() {
    this.user = null;
    this.token = null;
    this.accountType = "GUEST"; // 'GUEST', 'CUSTOMER', 'RESELLER', 'WHOLESALER', 'ADMIN'
    this.listeners = [];
    this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem("dcbd_auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        this.user = parsed.user || null;
        this.token = parsed.token || null;
        this.accountType = parsed.accountType || (this.user ? this.user.account_type || "CUSTOMER" : "GUEST");
      }
    } catch (e) {
      this.user = null;
      this.token = null;
      this.accountType = "GUEST";
    }
  }

  save() {
    try {
      if (this.user && this.token) {
        localStorage.setItem(
          "dcbd_auth",
          JSON.stringify({
            user: this.user,
            token: this.token,
            accountType: this.accountType
          })
        );
      } else {
        localStorage.removeItem("dcbd_auth");
      }
    } catch (e) {}
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this));
  }

  setUser(user, token, accountType) {
    this.user = user;
    this.token = token || "TOKEN-" + Math.floor(Math.random() * 1000000);
    this.accountType = accountType || (user ? user.account_type || "CUSTOMER" : "GUEST");
    this.save();
  }

  logout() {
    this.user = null;
    this.token = null;
    this.accountType = "GUEST";
    this.save();
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  isCustomer() {
    return this.isAuthenticated() && (this.accountType === "CUSTOMER" || this.user?.account_type === "CUSTOMER");
  }

  isReseller() {
    return this.isAuthenticated() && (this.accountType === "RESELLER" || this.user?.account_type === "RESELLER" || this.isAdmin());
  }

  isWholesaler() {
    return this.isAuthenticated() && (this.accountType === "WHOLESALER" || this.user?.account_type === "WHOLESALER" || this.isAdmin());
  }

  isAdmin() {
    return this.isAuthenticated() && (this.accountType === "ADMIN" || this.user?.account_type === "ADMIN" || this.user?.role === "Full Access" || this.user?.role === "SUPER_ADMIN" || this.user?.worker_type === "Admin");
  }

  getAccountType() {
    return this.accountType || "GUEST";
  }

  getUserDisplayName() {
    if (!this.user) return "";
    return this.user.name || this.user.shop_name || this.user.user_name || "সম্মানিত সদস্য";
  }
}

export const authStore = new AuthStore();
