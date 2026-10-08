class Productstore {
  constructor() { this.data = {}; this.listeners = []; }
  subscribe(fn) { this.listeners.push(fn); }
  notify() { this.listeners.forEach(fn => fn(this.data)); }
}
export const productStore = new Productstore();
