/**
 * DREAM CART BD — FLOATING FIXED ACTIONS DOCK (FloatingActions.js)
 */

import { cartStore } from '../store/cartStore.js';

export function renderFloatingActions() {
  const cartCount = cartStore.getCount();

  return `
    <div id="floating-actions-dock" class="fixed right-4 bottom-20 sm:bottom-6 z-50 flex flex-col items-end gap-2.5">
      
      <!-- Live Chat Button -->
      <div class="relative group">
        <a 
          href="/chat" 
          class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-800"
          title="লাইভ চ্যাট সাপোর্ট"
          aria-label="Live Chat"
        >
          <svg class="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </a>
      </div>

      <!-- Call Button with Sub-Buttons -->
      <div class="relative group" id="call-menu-group">
        <button 
          id="btn-floating-call"
          class="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-800"
          title="সরাসরি কল করুন"
          aria-label="Call Us"
        >
          <svg class="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </button>

        <div id="call-sub-menu" class="hidden absolute right-0 bottom-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2.5 space-y-1.5 w-52 z-50 text-xs">
          <div class="font-bold text-slate-800 dark:text-white px-2 py-1 text-[11px] border-b border-slate-100 dark:border-slate-800">
            📞 সরাসরি ফোন করুন:
          </div>
          <a href="tel:01581703822" class="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition text-slate-800 dark:text-slate-100 font-bold">
            <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">১</span>
            <span>01581703822</span>
          </a>
          <a href="tel:01818273838" class="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition text-slate-800 dark:text-slate-100 font-bold">
            <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">২</span>
            <span>01818273838</span>
          </a>
        </div>
      </div>

      <!-- WhatsApp Button with Sub-Buttons -->
      <div class="relative group" id="wa-menu-group">
        <button 
          id="btn-floating-wa"
          class="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-800"
          title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
          aria-label="WhatsApp"
        >
          <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.636-.363-.984-.407-1.89-1.282-2.39-2.029-.499-.747-.58-1.468-.58-1.865 0-.417.208-.667.348-.823.14-.156.312-.195.416-.195.104 0 .208.001.299.006.104.005.234-.04.364.271.144.348.49 1.196.532 1.281.042.085.069.185.014.296-.055.111-.083.18-.166.277-.083.097-.175.217-.25.291-.083.084-.17.175-.073.342.097.167.433.714.929 1.155.639.569 1.177.745 1.344.828.167.084.263.07.361-.042.097-.111.416-.486.527-.652.111-.167.222-.139.375-.083.153.055.97.458 1.137.541.167.083.277.125.319.194.042.07.042.404-.102.809z"/>
          </svg>
        </button>

        <div id="wa-sub-menu" class="hidden absolute right-0 bottom-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2.5 space-y-1.5 w-56 z-50 text-xs">
          <div class="font-bold text-slate-800 dark:text-white px-2 py-1 text-[11px] border-b border-slate-100 dark:border-slate-800">
            💬 হোয়াটসঅ্যাপে চ্যাট করুন:
          </div>
          <a href="https://wa.me/8801581703822?text=Hello%20Dream%20Cart%20BD" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition text-emerald-700 dark:text-emerald-400 font-bold">
            <span class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs">১</span>
            <span>01581703822 (মাস্টার)</span>
          </a>
          <a href="https://wa.me/8801818273838?text=Hello%20Dream%20Cart%20BD" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 p-2 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition text-emerald-700 dark:text-emerald-400 font-bold">
            <span class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs">২</span>
            <span>01818273838 (অর্ডার ডেস্ক)</span>
          </a>
        </div>
      </div>

      <!-- Floating Cart Button -->
      <div class="relative group">
        <button 
          id="btn-floating-cart" 
          class="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-2 border-white dark:border-slate-800 relative"
          title="আপনার কার্ট দেখুন"
          aria-label="View Cart"
        >
          <svg class="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <span id="floating-cart-badge" class="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-xs min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-800 shadow-sm animate-bounce">
            ${cartCount}
          </span>
        </button>
      </div>

    </div>
  `;
}
