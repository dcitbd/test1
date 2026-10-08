/**
 * ============================================================================
 * DREAM CART BD — 10-STEP PRODUCT WIZARD (ProductWizard.js)
 * ============================================================================
 */

import { Sidebar } from "../../components/Sidebar.js";
import { ImageUploader } from "./ImageUploader.js";
import { VariantGenerator } from "./VariantGenerator.js";
import { ProductAPI } from "../../api/products.js";

export const ProductWizard = async (params = {}) => {
  const isEdit = !!params.id;
  let product = {};

  if (isEdit) {
    try {
      if (ProductAPI && typeof ProductAPI.getById === "function") {
        product = (await ProductAPI.getById(params.id)) || {};
      }
    } catch (e) {
      console.error("Failed to load product for edit:", e);
    }
  }

  const defaultSku = product.sku || ('DCBD-' + Date.now().toString().slice(-6));

  return `
    <div class="min-h-screen flex bg-slate-50 dark:bg-luxury-dark font-bengali">
      ${Sidebar?.render ? Sidebar.render("/admin/products") : ""}

      <main class="flex-1 p-6 sm:p-10 max-w-6xl mx-auto overflow-y-auto">
        
        <!-- Header -->
        <div class="pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="badge-info text-xs mb-1">ক্যাটালগ উইজার্ড</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ${isEdit ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট তৈরি করুন'}
            </h1>
          </div>
          <button id="save-product-wizard-btn" type="button" class="btn-primary py-3 px-6 text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25">
            <i data-lucide="save" class="w-4 h-4"></i> পণ্য সেভ করুন
          </button>
        </div>

        <form id="product-wizard-form" class="space-y-8">
          
          <!-- STEP 1: Basic Information -->
          <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="info" class="w-5 h-5 text-brand-500"></i> ১. মৌলিক তথ্য (Basic Info)
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">প্রোডাক্টের নাম *</label>
                <input type="text" id="wiz-name" required value="${product.product_name || ''}" placeholder="যেমন: Wireless Noise Cancelling Headphones" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none text-slate-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">SKU (Stock Keeping Unit) *</label>
                <input type="text" id="wiz-sku" required value="${defaultSku}" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono outline-none text-slate-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">বারকোড (Barcode / EAN)</label>
                <input type="text" id="wiz-barcode" value="${product.barcode || ''}" placeholder="890123456789" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono outline-none text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- STEP 2: Multi-Tier Pricing System -->
          <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="tag" class="w-5 h-5 text-brand-500"></i> ২. মাল্টি-টিয়ার প্রাইসিং (Multi-Tier Pricing)
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ক্রয় মূল্য (Cost)</label>
                <input type="number" id="wiz-purchase-price" value="${product.purchase_price || 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">রেগুলার মূল্য (MRP)</label>
                <input type="number" id="wiz-regular-price" value="${product.regular_price || 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-bold text-brand-600 mb-1">কাস্টমার বিক্রয় মূল্য *</label>
                <input type="number" id="wiz-selling-price" required value="${product.selling_price || 0}" class="w-full px-3 py-2 rounded-xl border border-brand-500 bg-white dark:bg-slate-900 text-sm font-bold outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">রিসেলার মূল্য</label>
                <input type="number" id="wiz-reseller-price" value="${product.reseller_price || 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">হোলসেল মূল্য</label>
                <input type="number" id="wiz-wholesale-price" value="${product.wholesale_price || 0}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- STEP 3: 10-Image Gallery System -->
          <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="images" class="w-5 h-5 text-brand-500"></i> ৩. ১০-ইমেজ গ্যালারি (Google Drive Sync)
            </h3>
            ${ImageUploader?.render ? ImageUploader.render(product.images || []) : ""}
          </div>

          <!-- STEP 4: Variant Matrix Generator -->
          <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="layers" class="w-5 h-5 text-brand-500"></i> ৪. প্রোডাক্ট ভ্যারিয়েন্ট ও অ্যাট্রিবিউট
            </h3>
            ${VariantGenerator?.render ? VariantGenerator.render(product.variants || []) : ""}
          </div>

        </form>

      </main>
    </div>
  `;
};

export default ProductWizard;
