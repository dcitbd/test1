/**
 * DREAM CART BD — STANDALONE HIGH-CONVERSION LANDING PAGE
 */

import { apiClient } from '../../api/client.js';
import { renderProductCard } from '../../components/ProductCard.js';

export async function renderLandingPage() {
  const prodRes = await apiClient.request("products/list");
  const allProducts = (prodRes.data && prodRes.data.items) || [];
  const featuredProducts = allProducts.slice(0, 8);

  return `
    <div class="space-y-12 pb-24 font-sans">
      <section class="rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-8 sm:p-14 border border-emerald-800/40 shadow-2xl text-center space-y-4">
        <span class="inline-block bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
          🔥 সীমিত সময়ের মেগা অফার
        </span>
        <h1 class="text-2xl sm:text-4xl md:text-5xl font-black max-w-3xl mx-auto leading-tight">
          সেরা মানের অথেন্টিক গ্যাজেট ও পণ্য সরাসরি <span class="text-emerald-400">আপনার দোরগোড়ায়!</span>
        </h1>
        <p class="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto">
          কোনো অগ্রিম পেমেন্ট ছাড়াই সারা দেশে ক্যাশ অন ডেলিভারিতে অর্ডার করুন।
        </p>
        <div class="pt-3 flex flex-wrap justify-center gap-3">
          <a href="/products" class="btn-primary text-xs py-3 px-6 shadow-glow">
            🌐 মূল ওয়েবসাইটে যান (সকল পণ্য) →
          </a>
        </div>
      </section>

      <section class="space-y-4">
        <div class="text-center space-y-1">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">ক্যাম্পেইনের আকর্ষণীয় পণ্যসমূহ</h2>
          <p class="text-xs text-slate-500">বিশেষ অফারে এখনই সংগ্রহ করুন</p>
        </div>
        <div class="product-grid">
          ${featuredProducts.map(p => renderProductCard(p)).join("")}
        </div>
      </section>
    </div>
  `;
}
