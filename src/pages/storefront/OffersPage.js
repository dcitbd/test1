/**
 * DREAM CART BD — OFFERS & PROMOTIONS PAGE (OffersPage.js)
 * Implements user requirements:
 * - Free shipping on orders >= ৳2,000
 * - 5% online prepayment discount
 * - Promo coupon codes & active promotional campaigns
 */

export function renderOffersPage() {
  return `
    <div class="space-y-8 pb-20 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4 text-center sm:text-left">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1 justify-center sm:justify-start">
          <a href="/" class="hover:text-emerald-600 transition">হোম</a>
          <span>/</span>
          <span class="text-slate-700 dark:text-slate-300 font-bold">স্পেশাল অফার</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
          <span>🎁</span> ড্রিম কার্ট বিডি বিশেষ অফার ও ডিসকাউন্ট
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          সাশ্রয়ী মূল্যে সেরা পণ্য পেতে আমাদের নিয়মিত অফারগুলো লুফে নিন
        </p>
      </div>

      <!-- Offers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Offer 1: Free Delivery -->
        <div class="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <span class="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              সবার প্রিয় অফার
            </span>
            <h3 class="text-2xl font-black">৳২,০০০+ কেনাকাটায় ফ্রি ডেলিভারি!</h3>
            <p class="text-xs text-emerald-100 leading-relaxed">
              যেকোনো পণ্য মিলিয়ে সর্বমোট ২০০০ টাকা বা তার বেশি অর্ডার করলেই ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (৳০)।
            </p>
          </div>
          <div class="pt-2">
            <a href="/products" class="btn-secondary bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold py-2.5 px-5 shadow-sm inline-flex">
              শপিং করুন →
            </a>
          </div>
        </div>

        <!-- Offer 2: 5% Online Prepayment Discount -->
        <div class="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <span class="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ডিজিটাল পেমেন্ট অফার
            </span>
            <h3 class="text-2xl font-black">অনলাইনে পেমেন্টে ৫% নগদ ছাড়!</h3>
            <p class="text-xs text-indigo-100 leading-relaxed">
              বিকাশ (Personal/Payment), নগদ, রকেট অথবা ব্যাংক ট্রান্সফারে অগ্রিম মূল্য পরিশোধ করলেই সাথে সাথে ৫% ডিসকাউন্ট।
            </p>
          </div>
          <div class="pt-2">
            <a href="/checkout" class="btn-secondary bg-white text-indigo-800 hover:bg-indigo-50 text-xs font-bold py-2.5 px-5 shadow-sm inline-flex">
              পেমেন্ট নিয়ম দেখুন →
            </a>
          </div>
        </div>

        <!-- Offer 3: Promo Coupon DREAM10 -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <span class="badge badge-warning text-[10px]">প্রমোশনাল কুপন</span>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">১০% অতিরিক্ত ডিসকাউন্ট কুপন</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              চেকআউটের সময় প্রোমো কোড ব্যবহার করে যেকোনো পণ্যে অতিরিক্ত ১০% ছাড় উপভোগ করুন।
            </p>
            <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <span class="font-mono text-sm font-black text-emerald-600 tracking-wider">DREAM10</span>
              <button class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600" onclick="navigator.clipboard.writeText('DREAM10'); alert('কুপন কোড কপি হয়েছে: DREAM10');">
                কপি কোড 📋
              </button>
            </div>
          </div>
          <a href="/products" class="btn-primary text-xs py-2.5 px-5 text-center">
            কুপন ব্যবহার করে পণ্য কিনুন →
          </a>
        </div>

        <!-- Offer 4: Reseller & Wholesale Margin -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <span class="badge badge-info text-[10px]">পার্টনার বেনিফিট</span>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">রিসেলার ও পাইকারি বিশেষ দাম</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              আপনি কি ব্যবসা করতে চান? আমাদের সাথে রিসেলার বা হোলসেলার হিসেবে নিবন্ধন করে সর্বনিম্ন পাইকারি রেটে পণ্য কিনুন।
            </p>
          </div>
          <div class="flex items-center gap-3">
            <a href="/reseller/register" class="btn-primary text-xs py-2.5 px-4 text-center flex-1">
              রিসেলার একাউন্ট
            </a>
            <a href="/wholesaler/register" class="btn-secondary text-xs py-2.5 px-4 text-center flex-1">
              হোলসেলার একাউন্ট
            </a>
          </div>
        </div>

      </div>

    </div>
  `;
}
