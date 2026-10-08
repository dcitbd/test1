/**
 * DREAM CART BD — MAIN NAVIGATION BAR (Header.js)
 * Implements user requirements:
 * - Top Notice / Announcement bar (Offer, Contact, Free shipping notice)
 * - logo + shop name
 * - Live predictive search bar with interactive instant preview cards
 * - Products link
 * - Cart button with live count badge
 * - Favourite Icon with live count badge
 * - Customer Login / Profile menu
 * - Darkmode toggle icon with persistence
 * - Fully responsive for mobile, tablet, laptop, desktop, and TV
 */

import { cartStore } from '../store/cartStore.js';
import { favouriteStore } from '../store/favouriteStore.js';
import { authStore } from '../store/authStore.js';

export function renderHeader() {
  const cartCount = cartStore.getCount();
  const favCount = favouriteStore.getCount();
  const isAuthenticated = authStore.isAuthenticated();
  const user = authStore.user;
  const isDark = document.documentElement.classList.contains('dark');

  return `
    <!-- Top Notice Bar (Offer, Contact, Free Delivery Alert) -->
    <div class="notice-bar bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-950 text-white text-xs py-2 px-3 sm:px-4 shadow-sm relative z-50">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div class="flex items-center gap-2 text-center md:text-left text-[11px] sm:text-xs">
          <span class="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-xs">নোটিশ</span>
          <span class="font-medium text-slate-100">
            ৳২,০০০ বা তার বেশি অর্ডারে <strong class="text-amber-300 font-bold">ফ্রি শিপিং!</strong> | অনলাইনে পেমেন্ট করলে <strong class="text-emerald-300 font-bold">৫% ছাড়</strong> | পণ্য হাতে পেয়ে মূল্য পরিশোধ
          </span>
        </div>
        <div class="flex items-center gap-3 text-[11px] sm:text-xs text-emerald-200 flex-shrink-0">
          <a href="https://wa.me/8801581703822" target="_blank" rel="noopener noreferrer" class="hover:text-white transition flex items-center gap-1 font-bold">
            <span>💬</span> 01581703822
          </a>
          <span class="text-emerald-500">|</span>
          <a href="tel:01818273838" class="hover:text-white transition flex items-center gap-1">
            <span>📞</span> 01818273838
          </a>
          <span class="text-emerald-500">|</span>
          <a href="/track" class="hover:text-white transition flex items-center gap-1">
            <span>🚚</span> ট্র্যাকিং
          </a>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        
        <!-- Logo + Shop Name -->
        <a href="/" class="flex items-center gap-2.5 group flex-shrink-0" title="Dream Cart BD Home">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10" 
              alt="Dream Cart BD Logo" 
              class="w-full h-full object-contain rounded-lg"
              onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10';"
            />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1">
              <span class="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                Dream Cart <span class="text-emerald-600">BD</span>
              </span>
            </div>
            <span class="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 -mt-1">
              Smart Digital Commerce
            </span>
          </div>
        </a>

        <!-- Live Predictive Search Bar with Dropdown Preview -->
        <div class="hidden md:flex flex-1 max-w-xl relative search-container">
          <div class="w-full relative">
            <input 
              type="text" 
              id="global-search-input"
              placeholder="পণ্য, ক্যাটাগরি, ব্র্যান্ড বা SKU দিয়ে সার্চ করুন..." 
              autocomplete="off"
              class="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-100/90 dark:hover:bg-slate-800/90 focus:bg-white dark:focus:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 dark:text-white outline-none transition shadow-inner"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button id="global-search-btn" class="absolute right-1 top-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-xs">
              Search
            </button>
          </div>

          <!-- Live Search Preview Popup Container -->
          <div id="search-preview-popup" class="hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            <!-- Dynamically populated via JavaScript -->
          </div>
        </div>

        <!-- Navigation Links & Icons -->
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          
          <!-- Products Link -->
          <a href="/products" class="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <span>🛍️</span> Products
          </a>

          <!-- Cart Button -->
          <button id="btn-open-cart" class="relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5" title="কার্ট দেখুন">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span class="hidden sm:inline text-xs font-bold">Cart</span>
            <span id="nav-cart-badge" class="min-w-[18px] h-[18px] rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center px-1 shadow-xs">
              ${cartCount}
            </span>
          </button>

          <!-- Favourite (Wishlist) Icon -->
          <a href="/favourite" class="relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5" title="পছন্দের তালিকা">
            <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span class="hidden sm:inline text-xs font-bold">Favourite</span>
            <span id="nav-fav-badge" class="min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center px-1 shadow-xs">
              ${favCount}
            </span>
          </a>

          <!-- Customer Login / Account Menu -->
          <div class="relative auth-dropdown-container">
            ${isAuthenticated ? `
              <button id="btn-user-menu" class="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold transition hover:bg-emerald-100">
                <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  ${(authStore.getUserDisplayName() || "U").charAt(0).toUpperCase()}
                </span>
                <span class="hidden sm:inline max-w-[80px] truncate">${authStore.getUserDisplayName()}</span>
                <span class="text-[10px]">▼</span>
              </button>
            ` : `
              <a href="/customer/login" class="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>লগইন</span>
              </a>
            `}

            <!-- Dropdown Menu -->
            <div id="auth-dropdown-panel" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
              ${isAuthenticated ? `
                <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div class="font-bold text-slate-900 dark:text-white truncate">${authStore.getUserDisplayName()}</div>
                  <div class="text-[10px] text-slate-400 capitalize">${authStore.getAccountType()}</div>
                </div>
                ${authStore.isAdmin() ? `<a href="/admin/dashboard" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-emerald-600">Admin Dashboard</a>` : ""}
                ${authStore.isReseller() ? `<a href="/reseller/dashboard" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-indigo-600">Reseller Portal</a>` : ""}
                ${authStore.isWholesaler() ? `<a href="/wholesaler/dashboard" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-amber-600">Wholesale Portal</a>` : ""}
                <a href="/customer/dashboard" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">My Orders & Profile</a>
                <a href="/customer/settings" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Settings</a>
                <button id="btn-logout" class="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-bold border-t border-slate-100 dark:border-slate-800">লগআউট</button>
              ` : `
                <a href="/customer/login" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">Customer Login</a>
                <a href="/reseller/login" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">Reseller Hub</a>
                <a href="/wholesaler/login" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">Wholesaler Hub</a>
                <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <a href="/admin/login" class="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 font-semibold">Admin / Worker Login</a>
              `}
            </div>
          </div>

          <!-- Darkmode Toggle Icon -->
          <button 
            id="btn-toggle-darkmode" 
            class="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
            title="${isDark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}"
            aria-label="Toggle Dark Mode"
          >
            <span class="dark:hidden text-base">🌙</span>
            <span class="hidden dark:inline text-base">☀️</span>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button 
            id="btn-mobile-menu-toggle" 
            class="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

        </div>

      </div>

      <!-- Mobile Search Bar (under header for small mobile screens) -->
      <div class="md:hidden px-4 pb-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div class="relative w-full">
          <input 
            type="text" 
            id="mobile-search-input"
            placeholder="পণ্য সার্চ করুন..." 
            autocomplete="off"
            class="w-full pl-9 pr-16 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white outline-none"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button id="mobile-search-btn" class="absolute right-1 top-1 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">
            Search
          </button>
        </div>
        <div id="mobile-search-preview-popup" class="hidden mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto"></div>
      </div>

      <!-- Mobile Navigation Drawer / Menu -->
      <div id="mobile-dropdown-menu" class="hidden md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 text-xs">
        <a href="/" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">🏠 Home</a>
        <a href="/products" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">🛍️ All Products</a>
        <a href="/categories" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">📂 Categories</a>
        <a href="/brands" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">🏷️ Brands</a>
        <a href="/offers" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">🎁 Special Offers</a>
        <a href="/track" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">🚚 Track Order</a>
        <a href="/chat" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">💬 Live Support</a>
        <div class="border-t border-slate-100 dark:border-slate-800 my-2"></div>
        <a href="/customer/login" class="block py-2 text-slate-700 dark:text-slate-200 font-bold hover:text-emerald-600">👤 Customer Login / Register</a>
        <a href="/reseller/login" class="block py-2 text-indigo-600 dark:text-indigo-400 font-bold">💼 Reseller Portal</a>
        <a href="/wholesaler/login" class="block py-2 text-amber-600 dark:text-amber-400 font-bold">📦 Wholesaler Portal</a>
        <a href="/admin/login" class="block py-2 text-slate-500 font-bold">⚙️ Admin / Worker Portal</a>
      </div>

    </header>
  `;
}
