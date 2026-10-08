/**
 * ============================================================================
 * DREAM CART BD — BUSINESS INTELLIGENCE & ANALYTICS REPORTS (Reports.js)
 * ============================================================================
 */

import { Sidebar } from "../../components/Sidebar.js";
import { OrderAPI } from "../../api/orders.js";

export const Reports = async () => {
  let orders = [];
  try {
    if (OrderAPI && typeof OrderAPI.getAll === "function") {
      const res = await OrderAPI.getAll();
      orders = Array.isArray(res) ? res : (res?.items || []);
    }
  } catch (e) {
    console.error("Reports data fetch failed:", e);
  }

  const ordersList = Array.isArray(orders) ? orders : [];
  const totalRevenue = ordersList.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const deliveredCount = ordersList.filter(o => o.order_status === 'delivered').length;
  const rtoCount = ordersList.filter(o => o.order_status === 'rto').length;

  return `
    <div class="min-h-screen flex bg-slate-50 dark:bg-luxury-dark font-bengali">
      ${Sidebar?.render ? Sidebar.render("/admin/dashboard") : ""}

      <main class="flex-1 p-6 sm:p-10 max-w-7xl mx-auto overflow-y-auto">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span class="badge-success text-xs mb-1">অ্যানালিটিক্স ও BI</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">বিজনেস ইন্টেলিজেন্স ও সেলস রিপোর্ট</h1>
            <p class="text-xs text-slate-500 mt-1">আয়, প্রফিট মার্জিন এবং কুরিয়ার ডেলিভারি সাকসেস রেশিও বিশ্লেষণ</p>
          </div>
          <button type="button" onclick="window.print ? window.print() : null" class="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> রিপোর্ট প্রিন্ট
          </button>
        </div>

        <!-- Financial KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-xs text-brand-500 font-bold uppercase">সর্বমোট রাজস্ব (Gross Sales)</span>
            <h3 class="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">৳${totalRevenue.toLocaleString()}</h3>
          </div>
          <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-xs text-emerald-500 font-bold uppercase">সফল ডেলিভারি</span>
            <h3 class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${deliveredCount} টি</h3>
          </div>
          <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-xs text-rose-500 font-bold uppercase">রিটার্ন / RTO পার্সেল</span>
            <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">${rtoCount} টি</h3>
          </div>
          <div class="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span class="text-xs text-amber-500 font-bold uppercase">নেট প্রফিট মার্জিন (Est.)</span>
            <h3 class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">~২২.৪%</h3>
          </div>
        </div>

        <!-- Performance Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Courier Success Ratios -->
          <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              কুরিয়ারভিত্তিক ডেলিভারি পারফরম্যান্স
            </h3>
            
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>Steadfast Courier</span>
                  <span class="text-emerald-600">৯৪% সাকসেস</span>
                </div>
                <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 94%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>Pathao Courier</span>
                  <span class="text-brand-600">৯১% সাকসেস</span>
                </div>
                <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-brand-500 rounded-full" style="width: 91%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>RedX Logistics</span>
                  <span class="text-amber-600">৮৮% সাকসেস</span>
                </div>
                <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full" style="width: 88%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Selling Leaderboard -->
          <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              টপ সেলিং প্রোডাক্টস
            </h3>
            <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div class="py-2.5 flex justify-between">
                <span class="font-bold text-slate-900 dark:text-white">1. Smart Watch Ultra Edition</span>
                <span class="font-extrabold text-brand-600">১২৪ টি বিক্রিত</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="font-bold text-slate-900 dark:text-white">2. Wireless Gaming Earbuds Pro</span>
                <span class="font-extrabold text-brand-600">৯৮ টি বিক্রিত</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="font-bold text-slate-900 dark:text-white">3. Genuine Leather Wallet</span>
                <span class="font-extrabold text-brand-600">৭৬ টি বিক্রিত</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  `;
};

// Default export যুক্ত করা হয়েছে
export default Reports;
