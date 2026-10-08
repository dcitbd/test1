/**
 * DREAM CART BD — HOME PAGE (HomePage.js)
 * Implements:
 * - Notice bar (Offer, Contact)
 * - Auto-sliding banners (unlimited banners supported)
 * - Extra Notice / opportunities (small card system)
 * - Brands small cards (from Brands sheet)
 * - Category product show (6*2 auto sliding / grid) for all categories from sheet
 * - Responsive layout for mobile, tablet, laptop, and TV
 */

import { renderProductCard } from '../../components/ProductCard.js';
import { apiClient } from '../../api/client.js';

export async function renderHomePage() {
  const prodRes = await apiClient.request("products/list");
  const products = (prodRes.data && prodRes.data.items) || [];

  const catRes = await apiClient.request("categories/list");
  const categories = (catRes.data && catRes.data.items) || [];

  const brandRes = await apiClient.request("brands/list");
  const brands = (brandRes.data && brandRes.data.items) || [];

  const bannerRes = await apiClient.request("banners/list");
  const banners = (bannerRes.data && bannerRes.data.items) || [];

  return `
    <div class="space-y-10 sm:space-y-14 pb-16">
      
      <!-- 1. Auto-sliding Banners Hero Section -->
      <section class="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
        <div id="hero-slider" class="relative w-full min-h-[360px] sm:min-h-[460px] md:min-h-[500px] flex items-center">
          
          ${banners.map((b, idx) => `
            <div class="banner-slide ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'} absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center" data-index="${idx}">
              
              <!-- Background Image with Gradient Overlay -->
              <img 
                src="${b.image_url}" 
                alt="${b.title}" 
                class="absolute inset-0 w-full h-full object-cover object-center opacity-40 select-none"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
              
              <!-- Content Overlay -->
              <div class="relative z-10 max-w-2xl px-6 sm:px-12 md:px-16 py-10 space-y-4">
                <span class="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ${b.tag || "বিশেষ অফার"}
                </span>

                <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  ${b.title}
                </h1>

                <p class="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-lg">
                  ${b.subtitle}
                </p>

                <div class="pt-2 flex flex-wrap items-center gap-3">
                  <a href="${b.link_url || '/products'}" class="btn-primary text-xs sm:text-sm py-2.5 sm:py-3 px-6 shadow-glow">
                    ${b.button_text || 'এখনই অর্ডার করুন'} →
                  </a>
                  <a href="/offers" class="btn-secondary text-xs sm:text-sm py-2.5 sm:py-3 px-5 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
                    সব অফার দেখুন
                  </a>
                </div>
              </div>

            </div>
          `).join("")}

          <!-- Slider Controls -->
          <div class="absolute bottom-4 left-6 sm:left-16 z-20 flex items-center gap-2">
            ${banners.map((_, i) => `
              <button 
                class="slider-dot w-8 h-2 rounded-full transition-all ${i === 0 ? 'bg-emerald-500 w-10' : 'bg-white/30'}"
                data-slide-target="${i}"
                aria-label="Go to slide ${i + 1}"
              ></button>
            `).join("")}
          </div>

          <!-- Prev/Next Arrow Buttons -->
          <button id="slider-btn-prev" class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-sm transition" aria-label="Previous Slide">
            ‹
          </button>
          <button id="slider-btn-next" class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-sm transition" aria-label="Next Slide">
            ›
          </button>

        </div>
      </section>

      <!-- 2. Extra Notice / Opportunities (Small Card System) -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3 hover:border-emerald-500/40 transition">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl flex-shrink-0">
            🚚
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">সারা দেশে ডেলিভারি</h4>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">২-৩ কর্মদিবসে ক্যাশ অন ডেলিভারি</p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3 hover:border-emerald-500/40 transition">
          <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl flex-shrink-0">
            🛡️
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">১০০% আসল পণ্য</h4>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">অথেন্টিক ইম্পোর্টার গ্যারান্টি</p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3 hover:border-emerald-500/40 transition">
          <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl flex-shrink-0">
            🎁
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">৫% অনলাইন ডিসকাউন্ট</h4>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">বিকাশ/নগদ পেমেন্টে অতিরিক্ত ছাড়</p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3 hover:border-emerald-500/40 transition">
          <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl flex-shrink-0">
            💬
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">২৪/৭ কাস্টমার সাপোর্ট</h4>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">01581703822 হোয়াটসঅ্যাপ</p>
          </div>
        </div>

      </section>

      <!-- 3. Brands Showcase (Small Cards from Brands Sheet) -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏷️</span> টপ ব্র্যান্ড সমূহ (Featured Brands)
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">আমাদের অফিসিয়াল ব্র্যান্ড পার্টনারগণ</p>
          </div>
          <a href="/brands" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            সব ব্র্যান্ড দেখুন →
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          ${brands.map(b => `
            <a 
              href="/products?brand=${encodeURIComponent(b.brand_name)}" 
              class="group bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:shadow-card-hover transition flex flex-col items-center justify-center text-center gap-2"
            >
              <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img 
                  src="${b.brand_image}" 
                  alt="${b.brand_name}" 
                  class="w-full h-full object-contain"
                  onerror="this.onerror=null; this.src='https://cdn.iconscout.com/icon/free/png-256/free-shield-icon-download-in-svg-png-gif-file-formats--safety-protection-security-secure-protect-pack-crime-icons-1779836.png?f=webp&w=128';"
                />
              </div>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition">
                ${b.brand_name}
              </span>
            </a>
          `).join("")}
        </div>
      </section>

      <!-- 4. Category Product Show (6*2 Layout & Auto Sliding) for all categories from sheet -->
      ${categories.map(cat => {
        const catProducts = products.filter(p => 
          (p.category && p.category.toLowerCase() === cat.category.toLowerCase()) ||
          (p.sub_category && p.sub_category.toLowerCase().includes(cat.category.toLowerCase()))
        );

        if (catProducts.length === 0) return "";

        return `
          <section class="space-y-4">
            
            <!-- Category Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 gap-2">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-base">
                  ⚡
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    ${cat.category}
                  </h2>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    ${cat.sub_category || "সেরা কালেকশন থেকে বেছে নিন"}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <a href="/products?cat=${encodeURIComponent(cat.category)}" class="btn-secondary text-xs py-1.5 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition">
                  সবগুলো দেখুন (${catProducts.length}) →
                </a>
              </div>
            </div>

            <!-- 6*2 Product Grid -->
            <div class="product-grid">
              ${catProducts.slice(0, 12).map(p => renderProductCard(p)).join("")}
            </div>

          </section>
        `;
      }).join("")}

      <!-- 5. All Products Highlights & Fast Discovery -->
      <section class="space-y-4 pt-4">
        <div class="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔥</span> সকল জনপ্রিয় পণ্য (Trending Collection)
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">আমাদের সেরা সেলিং আইটেমসমূহ</p>
          </div>
          <a href="/products" class="btn-primary text-xs py-1.5 px-4">
            সকল পণ্য (${products.length}) →
          </a>
        </div>

        <div class="product-grid">
          ${products.slice(0, 12).map(p => renderProductCard(p)).join("")}
        </div>
      </section>

      <!-- 6. Partner Opportunity Banner -->
      <section class="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="max-w-xl space-y-2 text-center md:text-left">
          <span class="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">ব্যবসার সুবর্ণ সুযোগ</span>
          <h3 class="text-xl sm:text-2xl font-black">আমাদের সাথে রিসেলার বা পাইকারি ব্যবসা শুরু করুন!</h3>
          <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            কোনো ধরনের ইনভেস্টমেন্ট ছাড়া নিজের ফেসবুক পেজ থেকে ড্রপশিপিং রিসেলিং করুন অথবা পাইকারি দামে বেশি মুনাফায় ব্যবসা বাড়ান।
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <a href="/reseller/register" class="btn-primary bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-3 px-6 shadow-md">
            রিসেলার হোন →
          </a>
          <a href="/wholesaler/register" class="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs py-3 px-6">
            পাইকারি ক্রেতা নিবন্ধন
          </a>
        </div>
      </section>

    </div>
  `;
}

// Named alias & default exports ensuring zero Rollup resolution errors
export const HomePage = renderHomePage;
export default renderHomePage;
