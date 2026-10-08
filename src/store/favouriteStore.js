/**
 * DREAM CART BD — FAVOURITE / WISHLIST STORE
 */

class FavouriteStore {
  constructor() {
    this.items = [];
    this.listeners = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("dcbd_favourites");
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("dcbd_favourites", JSON.stringify(this.items));
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

  has(productId) {
    return this.items.some(it => it.product_id === productId);
  }

  toggle(product) {
    const idx = this.items.findIndex(it => it.product_id === product.product_id);
    if (idx > -1) {
      this.items.splice(idx, 1);
      this.saveToStorage();
      return false;
    } else {
      this.items.push({
        product_id: product.product_id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brand: product.brand,
        selling_price: product.selling_price,
        original_price: product.original_price || product.regular_price,
        thumbnail: product.thumbnail || (product.images && product.images[0]) || "",
        stock: product.stock !== undefined ? product.stock : product.available_stock,
        category: product.category || product.category_name,
        wholesale_price: product.wholesale_price,
        reseller_price: product.reseller_price,
        min_order_qty: product.min_order_qty || product.min_order_q || 1
      });
      this.saveToStorage();
      return true;
    }
  }

  remove(productId) {
    this.items = this.items.filter(it => it.product_id !== productId);
    this.saveToStorage();
  }

  clear() {
    this.items = [];
    this.saveToStorage();
  }

  getCount() {
    return this.items.length;
  }

  getItems() {
    return this.items;
  }
}

export const favouriteStore = new FavouriteStore();
