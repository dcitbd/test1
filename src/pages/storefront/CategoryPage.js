/**
 * DREAM CART BD — ALL CATEGORIES PAGE (CategoryPage.js)
 * Implements user requirements:
 * - Category > Sub Category > Child Category hierarchy tree
 * - Category cards with image, product counter, and direct catalog filter links
 */

import { apiClient } from '../../api/client.js';

export async function renderCategoryPage() {
  const [catRes, prodRes] = await Promise.all([
    apiClient.request("categories/list"),
    apiClient.request("products/list")
  ]);

  const categories = (catRes.data && catRes.data.items) || [];
  const products = (prodRes.data && prodRes.data.items) || [];

  return `
    <div class="space-y-8 pb-20">
      
      <!-- Page Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <a href="/" class="hover:text-emerald-600 transition">হোম</a>
          <span>/</span>
          <span class="text-slate-700 dark:text-slate-300 font-bold">ক্যাটাগরি সমূহ</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>📂</span> সকল পণ্য ক্যাটাগরি (All Categories)
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          ক্যাটাগরি, সাব-ক্যাটাগরি ও চাইল্ড ক্যাটাগরি অনুসারে সহজে পণ্য খুঁজে নিন
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${categories.map(c => {
          const subCats = c.sub_category ? c.sub_category.split(",").map(s => s.trim()) : [];
          const childCats = c.chail_category ? c.chail_category.split(",").map(s => s.trim()) : [];
          const matchingProds = products.filter(p => p.category && p.category.toLowerCase() === c.category.toLowerCase());

          return `
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:border-emerald-500/50 transition flex flex-col justify-between space-y-5">
              
              <div class="flex items-start gap-4">
                <div class="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <img 
                    src="${c.category_image || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'}" 
                    alt="${c.category}" 
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">${c.catagory_id}</span>
                    <span class="text-xs font-bold text-emerald-600">${matchingProds.length} টি পণ্য</span>
                  </div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white mt-1">
                    <a href="/products?cat=${encodeURIComponent(c.category)}" class="hover:text-emerald-600 transition">
                      ${c.category}
                    </a>
                  </h3>
                  <p class="text-xs text-slate-500 mt-0.5">Slug: /${c.catagory_slug}</p>
                </div>
              </div>

              <!-- Hierarchy Tree Box: Sub Categories & Child Categories -->
              <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2.5">
                <div>
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    সাব-ক্যাটাগরি (Sub Categories):
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${subCats.map(sc => `
                      <a 
                        href="/products?cat=${encodeURIComponent(c.category)}&sub=${encodeURIComponent(sc)}" 
                        class="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition"
                      >
                        ${sc}
                      </a>
                    `).join("")}
                  </div>
                </div>

                ${childCats.length > 0 ? `
                  <div class="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      চাইল্ড ক্যাটাগরি (Child Categories):
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      ${childCats.map(cc => `
                        <a 
                          href="/products?cat=${encodeURIComponent(c.category)}&child=${encodeURIComponent(cc)}" 
                          class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-medium hover:bg-emerald-100 transition"
                        >
                          ↳ ${cc}
                        </a>
                      `).join("")}
                    </div>
                  </div>
                ` : ""}
              </div>

              <!-- View All Button -->
              <a 
                href="/products?cat=${encodeURIComponent(c.category)}" 
                class="btn-primary py-2 px-4 text-xs font-bold text-center block w-full"
              >
                ${c.category} এর সকল পণ্য দেখুন (${matchingProds.length}) →
              </a>

            </div>
          `;
        }).join("")}
      </div>

    </div>
  `;
}
