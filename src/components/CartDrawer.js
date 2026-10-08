/**
 * DREAM CART BD — SLIDING CART DRAWER COMPONENT (CartDrawer.js)
 * Clean path routing (/checkout, /cart), real-time calculations, free shipping threshold (৳2,000),
 * online 5% prepayment discount, promo coupon code input, darkmode support.
 */

import { cartStore } from '../store/cartStore.js';
import { formatCurrency } from '../utils/format.js';

export function renderCartDrawer() {
  const items = cartStore.items;
  const count = cartStore.getCount();
  const subtotal = cartStore.getSubtotal();
  const delivery = cartStore.getDeliveryCharge();
  const couponDiscount = cartStore.getCouponDiscount();
  const onlineDiscount = cartStore.getOnlinePaymentDiscount();
  const grandTotal = cartStore.getGrandTotal();

  const freeDeliveryThreshold = 2000;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return `
    <div id="cart-drawer-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden transition-opacity duration-300">
      
      <div id="cart-drawer-panel" class="fixed inset-y-0 right-0 max-w-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-50 transform translate-x-full transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800">
        
        <!-- Drawer Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div class="flex items-center gap-2">
            <span class="text-xl">🛒</span>
            <h3 class="font-black text-slate-900 dark:text-white text-base">আপনার শপিং কার্ট</h3>
            <span class="badge badge-info text-xs">${count} টি পণ্য</span>
          </div>
          <button id="btn-close-cart" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Close Cart">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Free Delivery Progress Bar (৳2,000 threshold) -->
        <div class="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900 text-xs">
          <div class="flex justify-between items-center text-emerald-800 dark:text-emerald-300 font-semibold mb-1.5">
            <span>${amountNeeded > 0 ? `৳${amountNeeded} আরও যোগ করলে ডেলিভারি সম্পূর্ণ ফ্রি!` : "🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!"}</span>
            <span>${progressPercent}%</span>
          </div>
          <div class="w-full bg-emerald-200/60 dark:bg-emerald-900 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-600 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
          <div class="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex justify-between">
            <span>২০০০ টাকার বেশি শপিংয়ে ফ্রি ডেলিভারি</span>
            <span class="font-bold">টার্গেট: ৳২,০০০</span>
          </div>
        </div>

        <!-- Cart Items Stream -->
        <div class="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
          ${items.length === 0 ? `
            <div class="py-16 text-center space-y-3">
              <div class="text-4xl text-slate-300 dark:text-slate-600">🛍️</div>
              <p class="text-xs text-slate-500 font-medium">আপনার কার্ট খালি আছে</p>
              <a href="/products" class="btn-primary text-xs py-2 px-4 inline-flex" onclick="document.getElementById('cart-drawer-overlay').classList.add('hidden'); document.getElementById('cart-drawer-panel').classList.add('translate-x-full');">
                পণ্য দেখুন →
              </a>
            </div>
          ` : items.map(it => `
            <div class="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
              <img 
                src="${it.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}" 
                alt="${it.name}" 
                class="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-900 dark:text-white truncate">
                  ${it.name}
                </h4>
                <div class="text-[11px] text-emerald-600 font-bold font-mono">
                  ${formatCurrency(it.price)} ${it.quantity > 1 ? `× ${it.quantity}` : ''}
                </div>
                ${it.color ? `<div class="text-[10px] text-slate-400">কালার: ${it.color}</div>` : ''}
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button 
                    class="btn-cart-minus px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                    data-product-id="${it.product_id}"
                    data-color="${it.color || ''}"
                    data-size="${it.size || ''}"
                  >-</button>
                  <span class="w-6 text-center font-bold text-xs text-slate-900 dark:text-white">
                    ${it.quantity}
                  </span>
                  <button 
                    class="btn-cart-plus px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                    data-product-id="${it.product_id}"
                    data-color="${it.color || ''}"
                    data-size="${it.size || ''}"
                  >+</button>
                </div>

                <button 
                  class="btn-cart-remove text-slate-400 hover:text-rose-600 p-1"
                  data-product-id="${it.product_id}"
                  data-color="${it.color || ''}"
                  data-size="${it.size || ''}"
                  title="মুছুন"
                >
                  ✕
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Drawer Footer: Calculations & Checkout Action -->
        ${items.length > 0 ? `
          <div class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 space-y-3">
            
            <!-- Price Summary -->
            <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div class="flex justify-between">
                <span>পণ্যের মূল্য:</span>
                <span class="font-bold text-slate-900 dark:text-white">${formatCurrency(subtotal)}</span>
              </div>
              <div class="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span class="font-bold ${delivery === 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}">
                  ${delivery === 0 ? '<span class="text-emerald-600 font-bold">ফ্রি (৳০)</span>' : formatCurrency(delivery)}
                </span>
              </div>
              ${onlineDiscount > 0 ? `
                <div class="flex justify-between text-emerald-600 font-bold">
                  <span>অনলাইন পেমেন্ট ৫% ছাড়:</span>
                  <span>-${formatCurrency(onlineDiscount)}</span>
                </div>
              ` : ""}
              <div class="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>সর্বমোট:</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">${formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <!-- Checkout CTA Button -->
            <a 
              href="/checkout" 
              id="btn-drawer-checkout" 
              class="btn-primary w-full py-3.5 text-center text-xs font-black shadow-lg flex items-center justify-center gap-2"
              onclick="document.getElementById('cart-drawer-overlay').classList.add('hidden'); document.getElementById('cart-drawer-panel').classList.add('translate-x-full');"
            >
              <span>অর্ডার সম্পন্ন করুন (Checkout)</span>
              <span>(${formatCurrency(grandTotal)}) →</span>
            </a>

            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <a href="/cart" class="hover:text-emerald-600 underline" onclick="document.getElementById('cart-drawer-overlay').classList.add('hidden'); document.getElementById('cart-drawer-panel').classList.add('translate-x-full');">
                সম্পূর্ণ কার্ট পেজ দেখুন ↗
              </a>
              <span>🔒 ক্যাশ অন ডেলিভারি</span>
            </div>

          </div>
        ` : ""}

      </div>
    </div>
  `;
}
