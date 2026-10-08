/**
 * DREAM CART BD — ALL BRANDS PAGE (BrandPage.js)
 * Implements user requirements:
 * - Brand list from Brands sheet (Brand_ID, Brand_Image, Brand_Name, Brand_Slug, Brand_Description)
 * - Brand cards with logo, description, product counter, and direct filter link
 */

import { apiClient } from '../../api/client.js';

export async function renderBrandPage() {
  const [brandRes, prodRes] = await Promise.all([
    apiClient.request("brands/list"),
    apiClient.request("products/list")
  ]);

  const brands = (brandRes.data && brandRes.data.items) || [];
  const products = (prodRes.data && prodRes.data.items) || [];

  return `
    <div class="space-y-8 pb-20">
      
      <!-- Page Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <a href="/" class="hover:text-emerald-600 transition">হোম</a>
          <span>/</span>
          <span class="text-slate-700 dark:text-slate-300 font-bold">ব্র্যান্ড সমূহ</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>🏷️</span> আমাদের ব্র্যান্ড পার্টনারগণ (All Brands)
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          বিশ্বমানের শীর্ষস্থানীয় অথেন্টিক ব্র্যান্ডের গ্যাজেট ও পণ্য সামগ্রী
        </p>
      </div>

      <!-- Brands Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${brands.map(b => {
          const brandProducts = products.filter(p => p.brand && p.brand.toLowerCase() === b.brand_name.toLowerCase());

          return `
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-card-hover transition flex flex-col justify-between space-y-4">
              
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="${b.brand_image}" 
                    alt="${b.brand_name}" 
                    class="w-full h-full object-contain"
                    onerror="this.onerror=null; this.src='https://cdn.iconscout.com/icon/free/png-256/free-shield-icon-download-in-svg-png-gif-file-formats--safety-protection-security-secure-protect-pack-crime-icons-1779836.png?f=webp&w=128';"
                  />
                </div>
                <div>
                  <span class="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">${b.brand_id}</span>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white mt-1">
                    ${b.brand_name}
                  </h3>
                  <div class="text-xs font-bold text-emerald-600">${brandProducts.length} টি পণ্য মজুদ</div>
                </div>
              </div>

              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ${b.brand_description || 'অফিশিয়াল অথেন্টিক ব্র্যান্ড পণ্য।'}
              </p>

              <a 
                href="/products?brand=${encodeURIComponent(b.brand_name)}" 
                class="btn-primary py-2 px-4 text-xs font-bold text-center block w-full"
              >
                ${b.brand_name} পণ্যসমূহ দেখুন (${brandProducts.length}) →
              </a>

            </div>
          `;
        }).join("")}
      </div>

    </div>
  `;
}
