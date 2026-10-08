/**
 * ============================================================================
 * DREAM CART BD — FRONTEND SPA ROUTER (router.js)
 * ============================================================================
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    // ব্রাউজারের ব্যাক/ফরোয়ার্ড বাটন হ্যান্ডেল করা
    window.addEventListener("popstate", () => {
      this.handleRoute();
    });
  }

  // রুট রেজিস্টার করার মেথড
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // নির্দিষ্ট পেজে নেভিগেট করার মেথড
  navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    this.handleRoute();
  }

  // রুট ম্যাচ করে DOM-এ রেন্ডার করার মাস্টার মেথড
  async handleRoute() {
    const path = window.location.pathname || "/";
    let handler = null;
    let params = {};

    // ডাইনামিক রুট ম্যাচিং (যেমন: /product/:id বা /order-success/:id)
    const matchedRoute = Object.keys(this.routes).find(route => {
      const routeRegex = new RegExp("^" + route.replace(/:\w+/g, "([^/]+)") + "$");
      return routeRegex.test(path);
    });

    if (matchedRoute) {
      handler = this.routes[matchedRoute];
      
      // ডায়নামিক প্যারামিটার এক্সট্রাক্ট করা
      const routeSegments = matchedRoute.split("/");
      const pathSegments = path.split("/");
      
      routeSegments.forEach((seg, idx) => {
        if (seg.startsWith(":")) {
          const paramName = seg.substring(1);
          params[paramName] = pathSegments[idx];
        }
      });
    } else if (this.routes["*"]) {
      handler = this.routes["*"];
    } else {
      handler = () => `
        <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center font-bengali">
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">৪০০৪ - পেজ পাওয়া যায়নি</h2>
            <p class="text-xs text-slate-500 mb-6">আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নয় বা সরিয়ে ফেলা হয়েছে।</p>
            <a href="/" class="px-6 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl inline-block">হোম পেজে ফিরে যান</a>
          </div>
        </div>
      `;
    }

    const appContainer = document.getElementById("app");
    if (!appContainer) {
      console.error("Root element #app not found in DOM!");
      return;
    }

    try {
      // লোডিং স্টেট বা আগের কনটেন্ট ক্লিয়ার করা
      let htmlContent = "";
      if (typeof handler === "function") {
        htmlContent = await handler(params);
      }

      appContainer.innerHTML = htmlContent;

      // Lucide Icons রেন্ডার করা (যদি থাকে)
      if (typeof lucide !== "undefined" && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }

      // পেজ পরিবর্তনের পর স্ক্রিন উপরে স্ক্রোল করা
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(`[Router Error] Failed to render path '${path}':`, err);
      appContainer.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center font-bengali">
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md">
            <h3 class="text-lg font-bold mb-2">রেন্ডারিং ত্রুটি</h3>
            <p class="text-xs text-slate-500 mb-4">এই পেজটি লোড করার সময় একটি অপ্রত্যাশিত সমস্যা ঘটেছে।</p>
            <a href="/" class="px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl inline-block">হোম পেজে ফিরে যান</a>
          </div>
        </div>
      `;
    }
  }
}

export const router = new Router();
export default router;
