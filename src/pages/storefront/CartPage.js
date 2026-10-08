/**
 * DREAM CART BD — CART PAGE (CartPage.js)
 * Implements user requirements:
 * - Cart item list with thumbnail, title, unit price, quantity increment/decrement, line total
 * - Complete order button (proceed to checkout)
 * - Dynamic delivery zone selection & fee auto-calculation
 * - Free shipping for orders >= ৳2,000
 * - 5% online prepayment discount
 * - Promo coupon validation
 */

import { cartStore } from '../../store/cartStore.js';
import { formatCurrency } from '../../utils/format.js';

export function renderCartPage() {
  const items = cartStore.items;
  const count = cartStore.getCount();
  const subtotal = cartStore.getSubtotal();
  const deliveryFee = cartStore.getDeliveryCharge();
  const isFreeDelivery = cartStore.isFreeDelivery();
  const onlineDiscount = cartStore.getOnlinePaymentDiscount();
  const couponDiscount = cartStore.getCouponDiscount();
  const grandTotal = cartStore.getGrandTotal();
  const currentZone = cartStore.deliveryZone;
  const currentPayment = cartStore.paymentMethod;

  if (items.length === 0) {
    return `
      <div class="py-20 text-center max-w-lg mx-auto space-y-4">
        <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">আপনার শপিং কার্ট খালি</h2>
        <p class="text-xs text-slate-500">আপনার কার্টে কোনো পণ্য যুক্ত করা হয়নি। আমাদের সেরা পণ্যগুলো দেখুন এবং অর্ডার করুন।</p>
        <a href="/products" class="btn-primary text-xs py-3 px-6 inline-flex shadow-sm">
          শপিং শুরু করুন →
        </a>
      </div>
    `;
  }

  return `
    <div class="space-y-8 pb-20">
      
      <!-- Page Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <a href="/" class="hover:text-emerald-600 transition">হোম</a>
          <span>/</span>
          <span class="text-slate-700 dark:text-slate-300 font-bold">শপিং কার্ট</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          শপিং কার্ট (${count} টি আইটেম)
        </h1>
      </div>

      <!-- Main Layout: Items Table (7 cols) + Order Summary (5 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Cart Items List -->
        <div class="lg:col-span-8 space-y-4">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs overflow-hidden">
            
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              ${items.map(it => `
                <div class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  <!-- Product Image & Details -->
                  <div class="flex items-center gap-3.5 flex-1">
                    <img 
                      src="${it.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}" 
                      alt="${it.name}" 
                      class="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        <a href="/product/${it.slug || it.product_id}" class="hover:text-emerald-600 transition">
                          ${it.name}
                        </a>
                      </h4>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        একক মূল্য: <span class="font-bold text-slate-800 dark:text-slate-200">${formatCurrency(it.price)}</span>
                        ${it.color ? ` | কালার: ${it.color}` : ''}
                      </div>
                    </div>
                  </div>

                  <!-- Quantity Controls & Line Total -->
                  <div class="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                    
                    <!-- Stepper -->
                    <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button 
                        class="btn-cart-minus px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                        data-product-id="${it.product_id}"
                        data-color="${it.color || ''}"
                        data-size="${it.size || ''}"
                      >
                        -
                      </button>
                      <span class="w-10 text-center font-bold text-xs text-slate-900 dark:text-white">
                        ${it.quantity}
                      </span>
                      <button 
                        class="btn-cart-plus px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                        data-product-id="${it.product_id}"
                        data-color="${it.color || ''}"
                        data-size="${it.size || ''}"
                      >
                        +
                      </button>
                    </div>

                    <!-- Line Total -->
                    <div class="text-right min-w-[70px]">
                      <div class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        ${formatCurrency(Number(it.price) * Number(it.quantity))}
                      </div>
                    </div>

                    <!-- Remove Item Button -->
                    <button 
                      class="btn-cart-remove text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                      data-product-id="${it.product_id}"
                      data-color="${it.color || ''}"
                      data-size="${it.size || ''}"
                      title="আইটেমটি মুছুন"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>

                  </div>

                </div>
              `).join("")}
            </div>

            <!-- Cart Table Footer -->
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <a href="/products" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                ← আরও পণ্য যোগ করুন
              </a>
              <button id="btn-clear-cart" class="text-rose-600 dark:text-rose-400 hover:underline">
                সম্পূর্ণ কার্ট খালি করুন
              </button>
            </div>

          </div>
        </div>

        <!-- Right: Order Calculation & Checkout Panel -->
        <div class="lg:col-span-4 space-y-5">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            
            <h3 class="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              অর্ডার সারাংশ (Order Summary)
            </h3>

            <!-- Delivery Zone Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ডেলিভারি এলাকা নির্বাচন করুন:
              </label>
              <select 
                id="cart-zone-select"
                class="form-control text-xs w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="cumilla" ${currentZone === 'cumilla' ? 'selected' : ''}>কুমিল্লা সদর (৳৭০)</option>
                <option value="dhaka" ${currentZone === 'dhaka' ? 'selected' : ''}>ঢাকার ভেতরে (৳৯০)</option>
                <option value="outside" ${currentZone === 'outside' ? 'selected' : ''}>ঢাকার বাইরে সমগ্র বাংলাদেশ (৳১২০)</option>
                <option value="pickup" ${currentZone === 'pickup' ? 'selected' : ''}>অফিস থেকে পিকআপ - পদুয়ার বাজার (৳০)</option>
              </select>
            </div>

            <!-- Free Shipping Progress Indicator -->
            <div class="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1.5">
              <div class="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                <span>৳২,০০০ শপিংয়ে ফ্রি ডেলিভারি!</span>
                <span>${subtotal >= 2000 ? '✓ অর্জিত!' : `আরও ৳${2000 - subtotal}`}</span>
              </div>
              <div class="w-full bg-emerald-200 dark:bg-emerald-900 rounded-full h-1.5 overflow-hidden">
                <div class="bg-emerald-600 h-full rounded-full transition-all duration-500" style="width: ${Math.min(100, (subtotal / 2000) * 100)}%"></div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <div class="flex justify-between">
                <span>পণ্যের মোট মূল্য:</span>
                <span class="font-bold text-slate-900 dark:text-white">${formatCurrency(subtotal)}</span>
              </div>

              <div class="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span class="font-bold text-slate-900 dark:text-white">
                  ${isFreeDelivery ? '<span class="text-emerald-600 font-bold">ফ্রি (৳০)</span>' : formatCurrency(deliveryFee)}
                </span>
              </div>

              ${onlineDiscount > 0 ? `
                <div class="flex justify-between text-emerald-600 font-bold">
                  <span>অনলাইন পেমেন্ট ছাড় (৫%):</span>
                  <span>-${formatCurrency(onlineDiscount)}</span>
                </div>
              ` : ""}

              ${couponDiscount > 0 ? `
                <div class="flex justify-between text-indigo-600 font-bold">
                  <span>কুপন ডিসকাউন্ট:</span>
                  <span>-${formatCurrency(couponDiscount)}</span>
                </div>
              ` : ""}

              <div class="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline text-sm sm:text-base font-black text-slate-900 dark:text-white">
                <span>সর্বমোট:</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold text-lg">${formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <!-- Complete Order Action Button -->
            <a 
              href="/checkout" 
              class="btn-primary w-full py-3.5 text-center text-xs sm:text-sm font-bold shadow-md block"
            >
              অর্ডার সম্পন্ন করুন (Checkout) →
            </a>

          </div>
        </div>

      </div>

    </div>
  `;
}
