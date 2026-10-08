/**
 * DREAM CART BD — CLEAN PATH SPA CLIENT ROUTER (router.js)
 * Implements clean path routing: domain/products, domain/cart, domain/admin (ZERO hash '#' URLs)
 * Supports GitHub Pages, Cloudflare Pages, C-Panel Apache (.htaccess), and local preview.
 */

import { renderHomePage } from './pages/storefront/HomePage.js';
import { renderShopPage } from './pages/storefront/ShopPage.js';
import { renderProductDetailPage } from './pages/storefront/ProductDetailPage.js';
import { renderCartPage } from './pages/storefront/CartPage.js';
import { renderWishlistPage } from './pages/storefront/WishlistPage.js';
import { renderCheckoutPage } from './pages/storefront/CheckoutPage.js';
import { renderOrderSuccessPage } from './pages/storefront/OrderSuccessPage.js';
import { renderTrackOrderPage } from './pages/storefront/TrackOrderPage.js';
import { renderContactPage } from './pages/storefront/ContactPage.js';
import { renderOffersPage } from './pages/storefront/OffersPage.js';
import { renderCategoryPage } from './pages/storefront/CategoryPage.js';
import { renderBrandPage } from './pages/storefront/BrandPage.js';
import { renderOthersMarketPage } from './pages/storefront/OthersMarketPage.js';
import { renderLiveChatPage } from './pages/storefront/LiveChatPage.js';
import { renderLandingPage } from './pages/storefront/LandingPage.js';
import { renderTermsPage, renderPrivacyPage } from './pages/storefront/TermsPage.js';
import { renderCustomerPortal } from './pages/customer/CustomerPortal.js';
import { renderResellerPortal } from './pages/partner/ResellerPortal.js';
import { renderWholesalePortal } from './pages/partner/WholesalePortal.js';
import { renderAdminPortal } from './pages/admin/AdminPortal.js';

export function getAppBase() {
  const meta = document.querySelector('meta[name="app-base"]');
  if (meta && meta.content) {
    return meta.content.replace(/\/$/, '');
  }
  if (window.__APP_BASE__) {
    return window.__APP_BASE__.replace(/\/$/, '');
  }

  // If on github.io with a project path: https://<user>.github.io/<repo>/
  if (window.location.hostname.includes('github.io')) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const knownTopRoutes = [
      'products', 'shop', 'product', 'cart', 'favourite', 'wishlist',
      'checkout', 'order-success', 'track', 'contact', 'offers',
      'categories', 'brands', 'others-market', 'chat', 'live-chat',
      'landing', 'terms', 'privacy', 'customer', 'reseller', 'wholesaler', 'admin'
    ];
    if (parts.length > 0 && !knownTopRoutes.includes(parts[0].toLowerCase())) {
      return '/' + parts[0];
    }
  }

  return '';
}

export const router = {
  routes: {
    '/': renderHomePage,
    '/home': renderHomePage,
    '/products': renderShopPage,
    '/shop': renderShopPage,
    '/cart': renderCartPage,
    '/favourite': renderWishlistPage,
    '/wishlist': renderWishlistPage,
    '/checkout': renderCheckoutPage,
    '/order': renderCheckoutPage,
    '/order-success': renderOrderSuccessPage,
    '/track': renderTrackOrderPage,
    '/tracking': renderTrackOrderPage,
    '/contact': renderContactPage,
    '/offers': renderOffersPage,
    '/categories': renderCategoryPage,
    '/brands': renderBrandPage,
    '/others-market': renderOthersMarketPage,
    '/chat': renderLiveChatPage,
    '/live-chat': renderLiveChatPage,
    '/landing': renderLandingPage,
    '/terms': renderTermsPage,
    '/privacy': renderPrivacyPage,
    
    // Customer Portal
    '/customer': renderCustomerPortal,
    '/customer/login': (params) => renderCustomerPortal({ ...params, subview: 'login' }),
    '/customer/register': (params) => renderCustomerPortal({ ...params, subview: 'register' }),
    '/customer/dashboard': (params) => renderCustomerPortal({ ...params, subview: 'dashboard' }),
    '/customer/settings': (params) => renderCustomerPortal({ ...params, subview: 'settings' }),

    // Reseller Portal
    '/reseller': renderResellerPortal,
    '/reseller/login': (params) => renderResellerPortal({ ...params, subview: 'login' }),
    '/reseller/register': (params) => renderResellerPortal({ ...params, subview: 'register' }),
    '/reseller/dashboard': (params) => renderResellerPortal({ ...params, subview: 'dashboard' }),

    // Wholesaler Portal
    '/wholesaler': renderWholesalePortal,
    '/wholesaler/login': (params) => renderWholesalePortal({ ...params, subview: 'login' }),
    '/wholesaler/register': (params) => renderWholesalePortal({ ...params, subview: 'register' }),
    '/wholesaler/dashboard': (params) => renderWholesalePortal({ ...params, subview: 'dashboard' }),

    // Admin / Worker Portal
    '/admin': renderAdminPortal,
    '/admin/login': (params) => renderAdminPortal({ ...params, subview: 'login' }),
    '/admin/dashboard': (params) => renderAdminPortal({ ...params, subview: 'dashboard' })
  },

  getCleanPath() {
    const base = getAppBase();
    let fullPath = window.location.pathname;

    // Handle GitHub Pages redirect stored in sessionStorage
    const redirectPath = sessionStorage.getItem('dcbd_spa_redirect');
    if (redirectPath) {
      sessionStorage.removeItem('dcbd_spa_redirect');
      window.history.replaceState(null, '', redirectPath);
      fullPath = redirectPath;
    }

    // Strip base if present
    if (base && fullPath.startsWith(base)) {
      fullPath = fullPath.slice(base.length);
    }

    // Backward compatibility: If old URL with '#' is entered, automatically strip '#' and replaceState
    if (window.location.hash) {
      const hashContent = window.location.hash.replace(/^#\/?/, '/');
      if (hashContent && hashContent !== '/') {
        const cleanDestination = (base || '') + hashContent;
        window.history.replaceState(null, '', cleanDestination);
        fullPath = hashContent.split('?')[0];
      }
    }

    if (!fullPath || fullPath === '') fullPath = '/';

    // Strip trailing slash unless root
    if (fullPath.length > 1 && fullPath.endsWith('/')) {
      fullPath = fullPath.slice(0, -1);
    }

    return fullPath.toLowerCase();
  },

  getQueryParams() {
    const params = {};
    const searchStr = window.location.search;
    if (searchStr) {
      new URLSearchParams(searchStr).forEach((val, key) => {
        params[key] = val;
      });
    }
    return params;
  },

  navigate(targetUrl, replace = false) {
    const base = getAppBase();
    let cleanTarget = targetUrl;
    
    // Strip hash if given
    cleanTarget = cleanTarget.replace(/^#\/?/, '/');
    if (!cleanTarget.startsWith('/')) cleanTarget = '/' + cleanTarget;

    const fullUrl = (base || '') + cleanTarget;

    if (replace) {
      window.history.replaceState(null, '', fullUrl);
    } else {
      window.history.pushState(null, '', fullUrl);
    }

    this.resolve();
  },

  async resolve() {
    const path = this.getCleanPath();
    const params = this.getQueryParams();

    const appContainer = document.getElementById('app-content');
    if (!appContainer) return;

    // Loading Skeleton
    appContainer.innerHTML = `
      <div class="py-12 space-y-6 max-w-7xl mx-auto">
        <div class="h-44 skeleton rounded-3xl"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="h-64 skeleton rounded-2xl"></div>
          <div class="h-64 skeleton rounded-2xl"></div>
          <div class="h-64 skeleton rounded-2xl"></div>
        </div>
      </div>
    `;

    try {
      let viewHtml = "";

      // Dynamic Product Detail routing: /product/<slug>
      if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '');
        viewHtml = await renderProductDetailPage(slug);
      } else if (path === '/product') {
        const slug = params.slug || params.id || 'amazfit-gts-4-smartwatch';
        viewHtml = await renderProductDetailPage(slug);
      } else if (path === '/order-success') {
        viewHtml = await renderOrderSuccessPage(params.orderId || params.order_id || 'ORD-2609-8472');
      } else if (path === '/track') {
        viewHtml = await renderTrackOrderPage(params.orderId || params.phone || '');
      } else if (this.routes[path]) {
        viewHtml = await this.routes[path](params);
      } else {
        // 404 Fallback
        viewHtml = `
          <div class="py-24 text-center max-w-lg mx-auto space-y-3">
            <h1 class="text-6xl font-black text-emerald-600">404</h1>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
            <p class="text-xs text-slate-500">অনুরোধকৃত লিঙ্ক "${path}" বিদ্যমান নেই বা সরানো হয়েছে।</p>
            <div class="pt-2">
              <a href="/" class="btn-primary text-xs py-2.5 px-6 shadow-sm">মূল পাতায় ফিরে যান</a>
            </div>
          </div>
        `;
      }

      appContainer.innerHTML = viewHtml;
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error("Router resolution error:", err);
      appContainer.innerHTML = `
        <div class="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl text-center max-w-lg mx-auto mt-12 space-y-3">
          <div class="text-4xl">⚠️</div>
          <h3 class="text-slate-800 dark:text-white font-bold text-base">পৃষ্ঠাটি লোড করা সম্ভব হয়নি</h3>
          <p class="text-xs text-slate-500">${err.message || err.toString()}</p>
          <a href="/" class="btn-primary mt-2 text-xs py-2 px-5 inline-flex">মূল পাতায় ফিরুন</a>
        </div>
      `;
    }
  }
};
