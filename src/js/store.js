/**
 * ============================================================================
 * DREAM CART BD — REACTIVE GLOBAL STORE & STATE MANAGER (store.js)
 * ============================================================================
 */

import { Toast } from "../components/Toast.js";

// SSR / বিল্ড টাইমে এরর এড়াতে নিরাপদ স্টোরেজ হেল্পার
const getStorageItem = (key, fallback = null) => {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
};

const setStorageItem = (key, value) => {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    try {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (e) {}
  }
};

const removeStorageItem = (key) => {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

class GlobalStore {
  constructor() {
    this.listeners = new Map();

    const savedUser = getStorageItem("dcbd_user");
    const savedCart = getStorageItem("dcbd_cart");
    const savedTheme = getStorageItem("dcbd_theme", "light");

    let parsedUser = null;
    try {
      parsedUser = savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      parsedUser = null;
    }

    let parsedCart = { items: [], subtotal: 0, discount: 0, shipping: 0, total: 0 };
    try {
      if (savedCart) parsedCart = JSON.parse(savedCart);
    } catch (e) {}

    this.state = {
      user: parsedUser,
      token: getStorageItem("dcbd_token"),
      cart: parsedCart,
      theme: savedTheme,
      currency: "৳",
      isCartDrawerOpen: false,
      isSidebarOpen: false
    };

    // ব্রাউজার থাকলে থিম অ্যাপ্লাই হবে
    this.applyTheme(this.state.theme);
  }

  // ==================== EVENT BUS / SUBSCRIBERS ====================
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    // ডুপ্লিকেট লিসেনার এড়াতে চেক করা
    const callbacks = this.listeners.get(event);
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data = {}) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  // ==================== CART ACTIONS ====================
  addToCart(product, quantity = 1, selectedVariant = null) {
    if (!product) return;
    const cart = this.state.cart;
    const cartItemId = selectedVariant ? `${product.product_id}_${selectedVariant.variant_id}` : product.product_id;
    const existingIndex = cart.items.findIndex(item => item.cartItemId === cartItemId);

    const unitPrice = selectedVariant 
      ? Number(selectedVariant.selling_price) 
      : Number(product.selling_price || product.regular_price || 0);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        cartItemId: cartItemId,
        productId: product.product_id,
        variantId: selectedVariant ? selectedVariant.variant_id : null,
        name: product.product_name || product.name || "পণ্য",
        variantName: selectedVariant ? selectedVariant.variant_name : null,
        image: product.thumbnail || product.image || (product.images && product.images[0]?.image_url) || "",
        unitPrice: unitPrice,
        quantity: Number(quantity)
      });
    }

    this.recalculateCart();
    this.showToast(`${product.product_name || product.name || "পণ্য"} কার্টে যুক্ত হয়েছে!`, "success");
    this.emit("cart_updated", this.state.cart);
  }

  removeFromCart(cartItemId) {
    this.state.cart.items = this.state.cart.items.filter(item => item.cartItemId !== cartItemId);
    this.recalculateCart();
    this.showToast("পণ্যটি কার트 থেকে মুছে ফেলা হয়েছে", "info");
    this.emit("cart_updated", this.state.cart);
  }

  updateCartQty(cartItemId, newQty) {
    const item = this.state.cart.items.find(i => i.cartItemId === cartItemId);
    if (item) {
      item.quantity = Math.max(1, Number(newQty));
      this.recalculateCart();
      this.emit("cart_updated", this.state.cart);
    }
  }

  clearCart() {
    this.state.cart = { items: [], subtotal: 0, discount: 0, shipping: 0, total: 0 };
    this.saveCart();
    this.emit("cart_updated", this.state.cart);
  }

  recalculateCart() {
    let subtotal = 0;
    this.state.cart.items.forEach(item => {
      subtotal += (Number(item.unitPrice || 0) * Number(item.quantity || 1));
    });

    this.state.cart.subtotal = subtotal;
    this.state.cart.total = Math.max(0, subtotal - (Number(this.state.cart.discount) || 0) + (Number(this.state.cart.shipping) || 0));
    this.saveCart();
  }

  saveCart() {
    setStorageItem("dcbd_cart", this.state.cart);
  }

  // ==================== AUTH ACTIONS ====================
  setAuth(user, token) {
    this.state.user = user;
    this.state.token = token;
    setStorageItem("dcbd_user", user);
    setStorageItem("dcbd_token", token || "");
    this.emit("auth_changed", this.state.user);
  }

  logout() {
    this.state.user = null;
    this.state.token = null;
    removeStorageItem("dcbd_user");
    removeStorageItem("dcbd_token");
    this.emit("auth_changed", null);
    this.showToast("সফলভাবে লগআউট হয়েছেন।", "info");
  }

  isAuthenticated() {
    return !!this.state.token && !!this.state.user;
  }

  hasRole(allowedRoles = []) {
    if (!this.isAuthenticated() || !this.state.user) return false;
    return allowedRoles.includes(this.state.user.role);
  }

  // ==================== THEME CONTROLLER ====================
  toggleTheme() {
    const nextTheme = this.state.theme === "dark" ? "light" : "dark";
    this.setTheme(nextTheme);
  }

  setTheme(theme) {
    this.state.theme = theme;
    setStorageItem("dcbd_theme", theme);
    this.applyTheme(theme);
    this.emit("theme_changed", theme);
  }

  applyTheme(theme) {
    if (typeof document !== "undefined" && document.documentElement) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }

  // ==================== TOAST NOTIFICATIONS CONNECTOR ====================
  showToast(message, type = "success", duration = 3500) {
    if (typeof window !== "undefined" && window.Toast && typeof window.Toast.show === "function") {
      window.Toast.show(message, type, duration);
    } else if (Toast && typeof Toast.show === "function") {
      Toast.show(message, type, duration);
    } else {
      console.log(`[Toast ${type}]:`, message);
    }
  }
}

export const store = new GlobalStore();

// ব্রাউজারে window.store সেট করা
if (typeof window !== "undefined") {
  window.store = store;
}

export default store;
