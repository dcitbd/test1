/**
 * DREAM CART BD — MOBILE BOTTOM NAVIGATION COMPONENT (MobileNav.js)
 * High-utility fixed bottom bar for mobile screens (320px - 767px):
 * Home, Products, Cart (with live badge), Wishlist (with live badge), Account
 */

import { cartStore } from '../store/cartStore.js';
import { favouriteStore } from '../store/favouriteStore.js';
import { authStore } from '../store/authStore.js';

export function renderMobileNav() {
  const cartCount = cartStore.getCount();
  const favCount = favouriteStore.getCount();
  const isAuth = authStore.isAuthenticated();
  const accountLink = isAuth ? (authStore.isAdmin() ? '/admin/dashboard' : (authStore.isReseller() ? '/reseller/dashboard' : (authStore.isWholesaler() ? '/wholesaler/dashboard' : '/customer/dashboard'))) : '/customer/login';

  return `
    <nav class="mobile-nav-bar md:hidden" aria-label="Mobile Navigation">
      
      <!-- 1. Home -->
      <a href="/" class="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition" title="হোম">
        <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span class="text-[10px] font-bold mt-1">হোম</span>
      </a>

      <!-- 2. Products -->
      <a href="/products" class="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition" title="পণ্য">
        <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
        </svg>
        <span class="text-[10px] font-bold mt-1">পণ্যসমূহ</span>
      </a>

      <!-- 3. Cart with badge -->
      <button id="mobile-cart-btn" class="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition relative" title="কার্ট">
        <div class="relative">
          <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <span class="absolute -top-1.5 -right-2 bg-emerald-600 text-white font-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5">
            ${cartCount}
          </span>
        </div>
        <span class="text-[10px] font-bold mt-1">কার্ট</span>
      </button>

      <!-- 4. Wishlist with badge -->
      <a href="/favourite" class="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition relative" title="পছন্দ">
        <div class="relative">
          <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          ${favCount > 0 ? `
            <span class="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5">
              ${favCount}
            </span>
          ` : ""}
        </div>
        <span class="text-[10px] font-bold mt-1">পছন্দ</span>
      </a>

      <!-- 5. Account / Login -->
      <a href="${accountLink}" class="flex flex-col items-center justify-center flex-1 h-full text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition" title="অ্যাকাউন্ট">
        <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span class="text-[10px] font-bold mt-1">${isAuth ? 'প্রোফাইল' : 'লগইন'}</span>
      </a>

    </nav>
  `;
}
