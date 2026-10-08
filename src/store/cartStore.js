/**
 * DREAM CART BD — CART STORE
 * Manages cart items, role-based pricing (Customer, Reseller, Wholesaler),
 * wholesale minimum order quantity enforcement, dynamic delivery fees
 * (Cumilla ৳70, Dhaka ৳90, Outside ৳120, Pickup ৳0),
 * free shipping on orders ৳2,000+, and 5% online prepayment discount.
 */

import { authStore } from './authStore.js';

class CartStore {
  constructor() {
    this.items = [];
    this.coupon = null;
    this.deliveryZone = "dhaka"; // 'cumilla', 'dhaka', 'outside', 'pickup'
    this.paymentMethod = "COD"; // 'COD', 'BKASH_PERSONAL', 'BKASH_PAYMENT', 'NAGAD_PERSONAL', 'ROCKET_PERSONAL', 'BANK', 'CASH_PAYMENT'
    this.listeners = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("dcbd_cart");
      if (stored) {
        this.items = JSON.parse(stored);
      }
      const savedZone = localStorage.getItem("dcbd_delivery_zone");
      if (savedZone) {
        this.deliveryZone = savedZone;
      }
      const savedMethod = localStorage.getItem("dcbd_payment_method");
      if (savedMethod) {
        this.paymentMethod = savedMethod;
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("dcbd_cart", JSON.stringify(this.items));
      localStorage.setItem("dcbd_delivery_zone", this.deliveryZone);
      localStorage.setItem("dcbd_payment_method", this.paymentMethod);
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

  /**
   * Determine unit price based on who is logged in:
   * - Wholesaler: wholesale_price (fallback selling_price)
   * - Reseller: reseller_price (fallback selling_price)
   * - Customer/Guest: selling_price
   */
  getProductPriceForCurrentRole(product) {
    if (authStore.isWholesaler() && product.wholesale_price) {
      return Number(product.wholesale_price);
    }
    if (authStore.isReseller() && product.reseller_price) {
      return Number(product.reseller_price);
    }
    return Number(product.selling_price || product.price || 0);
  }

  addItem(product, quantity = 1, options = {}) {
    const minQty = Number(product.min_order_qty || product.min_order_q || 1);
    
    // If Wholesaler, enforce minimum order quantity
    if (authStore.isWholesaler() && quantity < minQty) {
      quantity = minQty;
    }

    const price = this.getProductPriceForCurrentRole(product);
    const existingIndex = this.items.findIndex(
      it => it.product_id === product.product_id && it.color === (options.color || "") && it.size === (options.size || "")
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
      this.items[existingIndex].price = price; // update with current role price
    } else {
      this.items.push({
        product_id: product.product_id,
        sku: product.sku || "",
        name: product.name || product.p_name || "",
        slug: product.slug || "",
        price: price,
        original_price: product.original_price || product.regular_price || price,
        wholesale_price: product.wholesale_price || price,
        reseller_price: product.reseller_price || price,
        min_order_qty: minQty,
        thumbnail: product.thumbnail || (product.images && product.images[0]) || "",
        stock: product.stock !== undefined ? product.stock : 50,
        color: options.color || "",
        size: options.size || "",
        quantity: Math.max(1, quantity)
      });
    }

    this.saveToStorage();
  }

  updateQuantity(productId, qty, options = {}) {
    const idx = this.items.findIndex(
      it => it.product_id === productId && it.color === (options.color || "") && it.size === (options.size || "")
    );
    if (idx > -1) {
      const minQty = Number(this.items[idx].min_order_qty || 1);
      if (authStore.isWholesaler() && qty < minQty && qty > 0) {
        qty = minQty;
      }

      if (qty <= 0) {
        this.items.splice(idx, 1);
      } else {
        this.items[idx].quantity = qty;
      }
      this.saveToStorage();
    }
  }

  removeItem(productId, options = {}) {
    this.items = this.items.filter(
      it => !(it.product_id === productId && it.color === (options.color || "") && it.size === (options.size || ""))
    );
    this.saveToStorage();
  }

  clear() {
    this.items = [];
    this.coupon = null;
    this.saveToStorage();
  }

  setDeliveryZone(zone) {
    this.deliveryZone = zone;
    this.saveToStorage();
  }

  setPaymentMethod(method) {
    this.paymentMethod = method;
    this.saveToStorage();
  }

  applyCoupon(couponData) {
    this.coupon = couponData;
    this.notify();
  }

  removeCoupon() {
    this.coupon = null;
    this.notify();
  }

  getSubtotal() {
    return this.items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);
  }

  getCouponDiscount() {
    if (!this.coupon) return 0;
    return this.coupon.discount_amount || 0;
  }

  // Free shipping rule: Orders >= ৳2,000 or Office Pickup
  isFreeDelivery() {
    if (this.deliveryZone === "pickup") return true;
    return this.getSubtotal() >= 2000;
  }

  getDeliveryCharge() {
    if (this.isFreeDelivery()) {
      return 0;
    }
    switch (this.deliveryZone) {
      case "cumilla":
        return 70;
      case "dhaka":
        return 90;
      case "outside":
        return 120;
      case "pickup":
        return 0;
      default:
        return 90;
    }
  }

  // 5% discount for online prepayment
  isOnlinePayment() {
    const onlineMethods = ["BKASH_PERSONAL", "BKASH_PAYMENT", "NAGAD_PERSONAL", "ROCKET_PERSONAL", "BANK"];
    return onlineMethods.includes(this.paymentMethod);
  }

  getOnlinePaymentDiscount() {
    if (this.isOnlinePayment()) {
      const subtotal = this.getSubtotal();
      return Math.round(subtotal * 0.05);
    }
    return 0;
  }

  getGrandTotal() {
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryCharge();
    const couponDiscount = this.getCouponDiscount();
    const onlineDiscount = this.getOnlinePaymentDiscount();
    return Math.max(0, subtotal + delivery - couponDiscount - onlineDiscount);
  }

  getCount() {
    return this.items.reduce((sum, it) => sum + it.quantity, 0);
  }
}

export const cartStore = new CartStore();
