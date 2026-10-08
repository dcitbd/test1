class Adminstore {
  constructor() { this.data = {}; this.listeners = []; }
  subscribe(fn) { this.listeners.push(fn); }
  notify() { this.listeners.forEach(fn => fn(this.data)); }
}
export const adminStore = new Adminstore();
