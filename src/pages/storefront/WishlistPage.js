/**
 * DREAM CART BD — FAVOURITE / WISHLIST PAGE (WishlistPage.js)
 * Implements user requirements:
 * - Full product card grid for all favourite / wishlist items
 * - Responsive layout across devices
 * - Empty state with direct shopping link
 */

import { favouriteStore } from '../../store/favouriteStore.js';
import { renderProductCard } from '../../components/ProductCard.js';

export function renderWishlistPage() {
  const items = favouriteStore.getItems();
  const count = favouriteStore.getCount();

  return `
    <div class="space-y-6 pb-20">
      
      <!-- Page Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <a href="/" class="hover:text-emerald-600 transition">হোম</a>
            <span>/</span>
            <span class="text-slate-700 dark:text-slate-300 font-bold">পছন্দের তালিকা</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>❤️</span> পছন্দের পণ্যসমূহ (Favourite List)
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            আপনার সংরক্ষিত ${count} টি পণ্য
          </p>
        </div>

        ${count > 0 ? `
          <button 
            id="btn-clear-wishlist" 
            class="btn-secondary text-xs py-2 px-4 text-rose-600 dark:text-rose-400 border-rose-200 self-start sm:self-auto hover:bg-rose-50 dark:hover:bg-rose-950/40"
            onclick="import('../../store/favouriteStore.js').then(m => { m.favouriteStore.clear(); window.location.reload(); });"
          >
            সবগুলো মুছে ফেলুন ✕
          </button>
        ` : ""}
      </div>

      <!-- Content -->
      ${count === 0 ? `
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs max-w-lg mx-auto space-y-4">
          <div class="w-20 h-20 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-full flex items-center justify-center mx-auto text-4xl">
            ♡
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">আপনার পছন্দের তালিকা খালি</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            যেকোনো পণ্যের ওপরের লাভ (Love) আইকনে ক্লিক করে আপনি পছন্দের তালিকায় সংরক্ষণ করতে পারবেন।
          </p>
          <a href="/products" class="btn-primary text-xs py-3 px-6 inline-flex shadow-sm">
            পণ্য ব্রাউজ করুন →
          </a>
        </div>
      ` : `
        <div class="product-grid">
          ${items.map(p => renderProductCard(p)).join("")}
        </div>
      `}

    </div>
  `;
}
