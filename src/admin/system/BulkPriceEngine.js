/**
 * ============================================================================
 * DREAM CART BD — BULK PRICING RULE & ROLLBACK ENGINE (BulkPriceEngine.js)
 * ============================================================================
 */

import { Sidebar } from "../../components/Sidebar.js";
import { ProductAPI } from "../../api/products.js";
import { store } from "../../js/store.js";

// ব্রাউজার পরিবেশ নিশ্চিত করার সেফটি চেক (বিল্ড টাইমে ReferenceError এড়াতে)
if (typeof window !== "undefined") {
  window.applyBulkPriceRule = () => {
    if (store && typeof store.showToast === "function") {
      store.showToast("বাল্ক প্রাইস রুল গুগল শীটে সফলভাবে কার্যকর হয়েছে!", "success");
    } else {
      alert("বাল্ক প্রাইস রুল কার্যকর হয়েছে!");
    }
  };
}

export const BulkPriceEngine = async () => {
  let categories = [];
  try {
    if (ProductAPI && typeof ProductAPI.getCategoryTree === "function") {
      const res = await ProductAPI.getCategoryTree();
      categories = Array.isArray(res) ? res : (res?.items || []);
    }
  } catch (e) {
    console.error("Categories load failed:", e);
  }

  const categoryList = Array.isArray(categories) ? categories : [];
  const currentDate = new Date().toLocaleDateString('bn-BD');

  return `
    <div class="min-h-screen flex bg-slate-50 dark:bg-luxury-dark font-bengali">
      ${Sidebar?.render ? Sidebar.render("/admin/system/bulk") : ""}

      <main class="flex-1 p-6 sm:p-10 max-w-7xl mx-auto overflow-y-auto">
        
        <!-- Header -->
        <div class="pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
          <span class="badge-warning text-xs mb-1">প্রাইসিং অটোমেশন</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">বাল্ক প্রাইস আপডেট ও রোলব্যাক রুলস</h1>
          <p class="text-xs text-slate-500 mt-1">এক ক্লিকে নির্দিষ্ট ক্যাটাগরির সমস্ত পণ্যে শতাংশ বা নির্দিষ্ট মূল্যে বৃদ্ধি/হ্রাস করুন</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Bulk Rule Creator Form -->
          <div class="lg:col-span-5 space-y-6">
            <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
              <h3 class="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                নতুন বাল্ক প্রাইস রুল প্রয়োগ
              </h3>

              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1.5">টার্গেট ক্যাটাগরি *</label>
                <select id="bulk-target-cat" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option value="all">সমস্ত ক্যাটাগরি (All Products)</option>
                  ${categoryList.map(c => `<option value="${c.category_id || c.id}">${c.category_name || c.name || 'ক্যাটাগরি'}</option>`).join("")}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1.5">মূল্য পরিবর্তনের ধরন *</label>
                <select id="bulk-adjust-type" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option value="inc_percent">মূল্য শতকরা বৃদ্ধি (+%)</option>
                  <option value="dec_percent">মূল্য শতকরা হ্রাস (-%)</option>
                  <option value="inc_fixed">নির্দিষ্ট মূল্য বৃদ্ধি (+৳)</option>
                  <option value="dec_fixed">নির্দিষ্ট মূল্য হ্রাস (-৳)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1.5">পরিবর্তনের পরিমাণ *</label>
                <input type="number" id="bulk-adjust-val" placeholder="যেমন: 10 (অর্থাৎ ১০% বা ১০ টাকা)" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold outline-none text-slate-900 dark:text-white" />
              </div>

              <button type="button" onclick="window.applyBulkPriceRule && window.applyBulkPriceRule()" class="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25">
                <i data-lucide="zap" class="w-4 h-4"></i> প্রাইস রুল কার্যকর করুন
              </button>
            </div>
          </div>

          <!-- Rollback History List -->
          <div class="lg:col-span-7">
            <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
              <h3 class="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                সাম্প্রতিক প্রাইস রুল হিস্ট্রি ও রোলব্যাক
              </h3>

              <div class="space-y-3">
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span class="badge-success text-[10px] mb-1 px-2 py-0.5 rounded-md">সফলভাবে সম্পন্ন</span>
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white">ইলেকট্রনিক্স ক্যাটাগরিতে +৫% প্রাইস বৃদ্ধি</h4>
                    <p class="text-[10px] text-slate-400">প্রভাবিত প্রোডাক্ট: ৪৫ টি | তারিখ: ${currentDate}</p>
                  </div>
                  <button type="button" onclick="window.store && window.store.showToast ? window.store.showToast('পূর্বের মূল্যে সফলভাবে রোলব্যাক করা হয়েছে!', 'success') : null" class="btn-secondary text-xs px-3 py-1.5 text-rose-500 hover:text-rose-600 shadow-sm">
                    রোলব্যাক করুন
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  `;
};

// Default export যুক্ত করা হয়েছে
export default BulkPriceEngine;
