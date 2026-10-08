/**
 * DREAM CART BD — PRODUCTS CATALOG PAGE (ShopPage.js)
 * Implements user requirements:
 * - 60 pcs show per page (with pagination)
 * - Filter by Category > Sub Category > Child Category tree (from sheet category tree)
 * - Filter by stock (In-stock filter from sheet)
 * - Filter by brand (from sheet)
 * - Filter by price (Low to High, High to Low)
 * - Search keyword support
 * - Role-based pricing in cards
 */

import { apiClient } from '../../api/client.js';
import { renderProductCard } from '../../components/ProductCard.js';

export async function renderShopPage(params = {}) {
  const cat = params.cat || "";
  const subCat = params.sub || "";
  const childCat = params.child || "";
  const brand = params.brand || "";
  const inStockOnly = params.in_stock === "1" || params.in_stock === true;
  const sort = params.sort || "featured";
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 60; // Exact user specification: 60pcs show per page

  // Fetch data
  const [prodRes, catRes, brandRes] = await Promise.all([
    apiClient.request("products/list"),
    apiClient.request("categories/list"),
    apiClient.request("brands/list")
  ]);

  let allProducts = (prodRes.data && prodRes.data.items) || [];
  const categories = (catRes.data && catRes.data.items) || [];
  const brands = (brandRes.data && brandRes.data.items) || [];

  // 1. Filter by Search Query
  if (search) {
    const q = search.toLowerCase().trim();
    allProducts = allProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // 2. Filter by Category Tree (Category > Sub Category > Child Category)
  if (cat) {
    const cLower = cat.toLowerCase();
    allProducts = allProducts.filter(p => p.category && p.category.toLowerCase() === cLower);
  }
  if (subCat) {
    const subLower = subCat.toLowerCase();
    allProducts = allProducts.filter(p => p.sub_category && p.sub_category.toLowerCase().includes(subLower));
  }
  if (childCat) {
    const childLower = childCat.toLowerCase();
    allProducts = allProducts.filter(p => p.child_category && p.child_category.toLowerCase().includes(childLower));
  }

  // 3. Filter by Brand
  if (brand) {
    const bLower = brand.toLowerCase();
    allProducts = allProducts.filter(p => p.brand && p.brand.toLowerCase() === bLower);
  }

  // 4. Filter by Stock
  if (inStockOnly) {
    allProducts = allProducts.filter(p => Number(p.stock !== undefined ? p.stock : 25) > 0);
  }

  // 5. Sort Products
  if (sort === "low_high") {
    allProducts.sort((a, b) => Number(a.selling_price) - Number(b.selling_price));
  } else if (sort === "high_low") {
    allProducts.sort((a, b) => Number(b.selling_price) - Number(a.selling_price));
  } else if (sort === "name_asc") {
    allProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  // Pagination (60 pcs per page)
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + pageSize);

  // Parse active category sub & child tree for hierarchy display
  const activeCategoryObj = categories.find(c => c.category && c.category.toLowerCase() === cat.toLowerCase());
  const subCategories = activeCategoryObj && activeCategoryObj.sub_category 
    ? activeCategoryObj.sub_category.split(",").map(s => s.trim()) 
    : [];
  const childCategories = activeCategoryObj && activeCategoryObj.chail_category 
    ? activeCategoryObj.chail_category.split(",").map(s => s.trim()) 
    : [];

  return `
    <div class="space-y-6 pb-20">
      
      <!-- Breadcrumb & Page Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 mb-2 flex-wrap">
          <a href="/" class="hover:text-emerald-600 transition">হোম</a>
          <span>/</span>
          <a href="/products" class="${!cat ? 'text-emerald-600 font-bold' : 'hover:text-emerald-600 transition'}">সকল পণ্য</a>
          ${cat ? `<span>/</span> <span class="text-slate-700 dark:text-slate-200 font-bold">${cat}</span>` : ""}
          ${subCat ? `<span>/</span> <span class="text-emerald-600 font-semibold">${subCat}</span>` : ""}
          ${childCat ? `<span>/</span> <span class="text-emerald-600 font-semibold">${childCat}</span>` : ""}
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ${search ? `সার্চ রেজাল্ট: "${search}"` : (cat ? `${cat}` : "আমাদের সকল পণ্যসমূহ")}
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              মোট ${totalProducts} টি পণ্য পাওয়া গেছে • পেজ প্রতি ৬০ টি পণ্য প্রদর্শন
            </p>
          </div>

          <!-- Quick Filters Reset -->
          ${(cat || subCat || childCat || brand || inStockOnly || search) ? `
            <a href="/products" class="btn-secondary text-xs py-1.5 px-3 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 self-start sm:self-auto">
              ফিল্টার মুছুন ✕
            </a>
          ` : ""}
        </div>
      </div>

      <!-- Mobile Filter Toggle Button -->
      <button 
        id="btn-toggle-shop-filters" 
        type="button"
        class="lg:hidden w-full py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs flex items-center justify-between shadow-xs mb-3 text-slate-800 dark:text-white"
        onclick="var f = document.getElementById('shop-sidebar-filter'); if(f) f.classList.toggle('hidden');"
      >
        <span class="flex items-center gap-2">📂 ফিল্টার অপশন (ক্যাটাগরি ও ব্র্যান্ড)</span>
        <span class="text-emerald-600 font-bold">টগল করুন ▾</span>
      </button>

      <!-- Main Layout: Sidebar Filter + Product Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        <!-- Left Filter Panel -->
        <aside id="shop-sidebar-filter" class="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-6 shadow-xs sticky top-20">
          
          <!-- Category Tree Filter (Category > Sub > Child) -->
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center justify-between">
              <span>📂 ক্যাটাগরি ফিল্টার</span>
              ${cat ? `<a href="/products" class="text-[10px] text-emerald-600 lowercase font-normal">ক্লিয়ার</a>` : ""}
            </h3>
            
            <div class="space-y-1 text-xs">
              <a 
                href="/products" 
                class="block px-3 py-2 rounded-xl transition ${!cat ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
              >
                সকল ক্যাটাগরি (${prodRes.data?.total || allProducts.length})
              </a>

              ${categories.map(c => {
                const isActiveCat = cat.toLowerCase() === (c.category || "").toLowerCase();
                return `
                  <div>
                    <a 
                      href="/products?cat=${encodeURIComponent(c.category)}" 
                      class="flex items-center justify-between px-3 py-2 rounded-xl transition ${isActiveCat ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
                    >
                      <span>${c.category}</span>
                      <span class="text-[10px] opacity-60">›</span>
                    </a>

                    <!-- Sub Categories Tree -->
                    ${isActiveCat && subCategories.length > 0 ? `
                      <div class="pl-4 pr-1 py-1.5 space-y-1 my-1 border-l-2 border-emerald-500/40 ml-3">
                        <div class="text-[10px] uppercase font-bold text-slate-400">সাব-ক্যাটাগরি:</div>
                        ${subCategories.map(sc => `
                          <a 
                            href="/products?cat=${encodeURIComponent(c.category)}&sub=${encodeURIComponent(sc)}" 
                            class="block px-2.5 py-1 rounded-lg text-[11px] ${subCat.toLowerCase() === sc.toLowerCase() ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'}"
                          >
                            • ${sc}
                          </a>
                        `).join("")}

                        <!-- Child Categories Tree -->
                        ${childCategories.length > 0 ? `
                          <div class="text-[10px] uppercase font-bold text-slate-400 pt-1">চাইল্ড ক্যাটাগরি:</div>
                          ${childCategories.map(cc => `
                            <a 
                              href="/products?cat=${encodeURIComponent(c.category)}&sub=${encodeURIComponent(subCat)}&child=${encodeURIComponent(cc)}" 
                              class="block px-2.5 py-1 rounded-lg text-[10px] ${childCat.toLowerCase() === cc.toLowerCase() ? 'bg-emerald-700 text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'}"
                            >
                              ↳ ${cc}
                            </a>
                          `).join("")}
                        ` : ""}
                      </div>
                    ` : ""}
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Stock Filter -->
          <div class="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
              📦 স্টক স্ট্যাটাস
            </h3>
            <label class="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input 
                type="checkbox" 
                id="filter-in-stock"
                ${inStockOnly ? 'checked' : ''}
                class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                onchange="window.location.href='/products?cat=${encodeURIComponent(cat)}&brand=${encodeURIComponent(brand)}&in_stock=' + (this.checked ? '1' : '0') + '&sort=${sort}'"
              />
              <span class="font-bold">শুধুমাত্র স্টকে থাকা পণ্য (In Stock)</span>
            </label>
          </div>

          <!-- Brand Filter -->
          <div class="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
              🏷️ ব্র্যান্ড সমূহ
            </h3>
            <div class="space-y-1 text-xs max-h-48 overflow-y-auto">
              <a 
                href="/products?cat=${encodeURIComponent(cat)}&in_stock=${inStockOnly ? '1' : '0'}&sort=${sort}" 
                class="block px-2.5 py-1.5 rounded-lg ${!brand ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}"
              >
                সকল ব্র্যান্ড
              </a>
              ${brands.map(b => `
                <a 
                  href="/products?cat=${encodeURIComponent(cat)}&brand=${encodeURIComponent(b.brand_name)}&in_stock=${inStockOnly ? '1' : '0'}&sort=${sort}" 
                  class="block px-2.5 py-1.5 rounded-lg ${brand.toLowerCase() === b.brand_name.toLowerCase() ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}"
                >
                  ${b.brand_name}
                </a>
              `).join("")}
            </div>
          </div>

        </aside>

        <!-- Right Products Column -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Controls Toolbar: Sort by price & Layout info -->
          <div class="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="text-slate-500 dark:text-slate-400">
              দেখাচ্ছে <strong class="text-slate-900 dark:text-white">${totalProducts === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + pageSize, totalProducts)}</strong> (সর্বমোট ${totalProducts} টির মধ্যে)
            </div>

            <!-- Sort By Dropdown -->
            <div class="flex items-center gap-2">
              <span class="text-slate-500 dark:text-slate-400 font-medium">সর্ট করুন:</span>
              <select 
                id="catalog-sort-select"
                class="form-control py-1.5 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
                onchange="window.location.href='/products?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(subCat)}&brand=${encodeURIComponent(brand)}&in_stock=${inStockOnly ? '1' : '0'}&sort=' + this.value"
              >
                <option value="featured" ${sort === 'featured' ? 'selected' : ''}>জনপ্রিয় পণ্য (Featured)</option>
                <option value="low_high" ${sort === 'low_high' ? 'selected' : ''}>দাম: কম থেকে বেশি (Low to High)</option>
                <option value="high_low" ${sort === 'high_low' ? 'selected' : ''}>দাম: বেশি থেকে কম (High to Low)</option>
                <option value="name_asc" ${sort === 'name_asc' ? 'selected' : ''}>নাম: A থেকে Z</option>
              </select>
            </div>
          </div>

          <!-- Product Grid -->
          ${paginatedProducts.length === 0 ? `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div class="text-5xl">🔍</div>
              <h3 class="text-base font-bold text-slate-800 dark:text-white">কোনো পণ্য পাওয়া যায়নি</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">
                আপনার দেওয়া ফিল্টারের সাথে মিলে এমন কোনো পণ্য মেলেনি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।
              </p>
              <a href="/products" class="btn-primary mt-2 text-xs py-2 px-5 inline-flex">
                সকল পণ্য দেখুন
              </a>
            </div>
          ` : `
            <div class="product-grid">
              ${paginatedProducts.map(p => renderProductCard(p)).join("")}
            </div>
          `}

          <!-- Pagination Controls (60 pcs per page) -->
          ${totalPages > 1 ? `
            <div class="flex items-center justify-center gap-2 pt-6">
              <a 
                href="/products?cat=${encodeURIComponent(cat)}&page=${Math.max(1, page - 1)}&sort=${sort}" 
                class="btn-secondary py-2 px-4 text-xs font-bold ${page <= 1 ? 'pointer-events-none opacity-40' : ''}"
              >
                ← পূর্ববর্তী
              </a>

              <div class="flex items-center gap-1 text-xs font-bold">
                ${Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return `
                    <a 
                      href="/products?cat=${encodeURIComponent(cat)}&page=${pNum}&sort=${sort}" 
                      class="w-8 h-8 rounded-xl flex items-center justify-center transition ${pNum === page ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}"
                    >
                      ${pNum}
                    </a>
                  `;
                }).join("")}
              </div>

              <a 
                href="/products?cat=${encodeURIComponent(cat)}&page=${Math.min(totalPages, page + 1)}&sort=${sort}" 
                class="btn-secondary py-2 px-4 text-xs font-bold ${page >= totalPages ? 'pointer-events-none opacity-40' : ''}"
              >
                পরবর্তী →
              </a>
            </div>
          ` : ""}

        </div>

      </div>

    </div>
  `;
}

export const renderProductListPage = renderShopPage;
