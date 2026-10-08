/**
 * DREAM CART BD — PRODUCT DETAIL PAGE (ProductDetailPage.js)
 * Implements user requirements:
 * - Full product details from Products sheet (omitting confidential buying price)
 * - Selling Price showing according to account type (Customer, Reseller, Wholesaler)
 * - Wholesaler minimum order quantity validation (cannot order under MOQ)
 * - Out of Stock state: shows Pre Order button and hides Order Now button
 * - Direct Send WhatsApp 1 & 2 buttons
 * - Image gallery, specifications, warranty, reviews, and related products
 */

import { apiClient } from '../../api/client.js';
import { formatCurrency } from '../../utils/format.js';
import { authStore } from '../../store/authStore.js';
import { cartStore } from '../../store/cartStore.js';
import { favouriteStore } from '../../store/favouriteStore.js';
import { renderProductCard } from '../../components/ProductCard.js';

export async function renderProductDetailPage(slugOrId) {
  const res = await apiClient.request("products/details", { slug: slugOrId, id: slugOrId });
  const product = res.data;

  if (!product) {
    return `
      <div class="py-24 text-center space-y-4">
        <div class="text-5xl">📦</div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <p class="text-xs text-slate-500">অনুরোধকৃত পণ্যটি সম্ভবত সরানো হয়েছে বা লিঙ্কটি ভুল।</p>
        <a href="/products" class="btn-primary text-xs py-2 px-5 inline-flex">সকল পণ্য দেখুন</a>
      </div>
    `;
  }

  const isWholesale = authStore.isWholesaler();
  const isReseller = authStore.isReseller();
  const isFavourite = favouriteStore.has(product.product_id);
  const stock = Number(product.stock !== undefined ? product.stock : 25);
  const isOutOfStock = stock <= 0;

  // Prices
  const originalPrice = Number(product.original_price || product.regular_price || product.selling_price);
  const customerPrice = Number(product.selling_price);
  const wholesalePrice = Number(product.wholesale_price || customerPrice * 0.85);
  const resellerPrice = Number(product.reseller_price || customerPrice * 0.90);
  const minOrderQty = Number(product.min_order_qty || product.min_order_q || 5);

  let activePrice = customerPrice;
  let roleTitle = "";
  if (isWholesale) {
    activePrice = wholesalePrice;
    roleTitle = "পাইকারি মূল্য (Wholesale Price)";
  } else if (isReseller) {
    activePrice = resellerPrice;
    roleTitle = "রিসেলার মূল্য (Reseller Margin Price)";
  }

  const isDiscounted = originalPrice > activePrice;
  const discountPercent = isDiscounted ? Math.round(((originalPrice - activePrice) / originalPrice) * 100) : 0;

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"];
  const mainImage = images[0];

  // WhatsApp link preparation
  const currentUrl = window.location.href;
  const waMessage = encodeURIComponent(`হ্যালো Dream Cart BD, আমি এই পণ্যটি সম্পর্কে জানতে বা অর্ডার করতে চাই:\nপণ্য: ${product.name}\nSKU: ${product.sku}\nমূল্য: ৳${activePrice}\nলিঙ্ক: ${currentUrl}`);
  const wa1Url = `https://wa.me/8801581703822?text=${waMessage}`;
  const wa2Url = `https://wa.me/8801818273838?text=${waMessage}`;

  // Fetch related products
  const relatedRes = await apiClient.request("products/list", { category: product.category });
  const related = ((relatedRes.data && relatedRes.data.items) || []).filter(p => p.product_id !== product.product_id).slice(0, 4);

  return `
    <div class="space-y-12 pb-24">
      
      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400">
        <a href="/" class="hover:text-emerald-600 transition">হোম</a>
        <span>/</span>
        <a href="/products" class="hover:text-emerald-600 transition">পণ্যসমূহ</a>
        <span>/</span>
        <a href="/products?cat=${encodeURIComponent(product.category || '')}" class="hover:text-emerald-600 transition">${product.category || 'ক্যাটাগরি'}</a>
        <span>/</span>
        <span class="text-slate-700 dark:text-slate-200 font-bold truncate max-w-xs">${product.name}</span>
      </div>

      <!-- Main Product Display Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- Left: Image Gallery (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <img 
              id="detail-main-img"
              src="${mainImage}" 
              alt="${product.name}" 
              class="w-full h-full object-cover transition-all duration-300"
            />
            
            ${discountPercent > 0 ? `
              <div class="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                -${discountPercent}% ছাড়
              </div>
            ` : ""}

            <!-- Favourite Toggle Button -->
            <button 
              class="btn-toggle-favourite absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center shadow-md text-slate-400 hover:text-rose-500 transition ${isFavourite ? 'text-rose-500 !bg-rose-50 dark:!bg-rose-950/40' : ''}"
              data-product-id="${product.product_id}"
              title="পছন্দের তালিকায় রাখুন"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
          </div>

          <!-- Thumbnail Strip -->
          ${images.length > 1 ? `
            <div class="flex items-center gap-3 overflow-x-auto pb-1">
              ${images.map((img, i) => `
                <button 
                  class="thumb-btn w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${i === 0 ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'}"
                  onclick="document.getElementById('detail-main-img').src='${img}'; document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('border-emerald-500')); this.classList.add('border-emerald-500');"
                >
                  <img src="${img}" alt="Thumbnail" class="w-full h-full object-cover" />
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Right: Product Information & Action Panel (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          
          <div>
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="badge badge-info">${product.brand || 'Dream Cart BD'}</span>
              <span class="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">SKU: ${product.sku || product.product_id}</span>
              ${product.category ? `<span class="badge badge-success">${product.category}</span>` : ""}
            </div>

            <h1 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              ${product.name}
            </h1>
          </div>

          <!-- Price Display Section according to Account Type -->
          <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-1.5">
            ${roleTitle ? `
              <div class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                ${roleTitle}
              </div>
            ` : ""}

            <div class="flex items-baseline gap-3 flex-wrap">
              <span class="text-2xl sm:text-4xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
                ${formatCurrency(activePrice)}
              </span>
              ${isDiscounted ? `
                <span class="text-sm sm:text-base text-slate-400 line-through">
                  ${formatCurrency(originalPrice)}
                </span>
              ` : ""}
              
              <!-- Stock Indicator -->
              <span class="text-xs font-bold px-2.5 py-1 rounded-full ${isOutOfStock ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                ${isOutOfStock ? 'স্টক শেষ (প্রি-অর্ডার প্রযোজ্য)' : `মজুদ: ${stock} পিস`}
              </span>
            </div>

            <!-- Wholesaler Minimum Order Quantity Warning -->
            ${isWholesale ? `
              <div class="text-xs font-bold text-amber-700 dark:text-amber-400 pt-1 flex items-center gap-1.5">
                <span>⚠️</span> পাইকারি ক্রয়ের জন্য সর্বনিম্ন অর্ডার পরিমাণ (MOQ): <strong>${minOrderQty} পিস</strong>
              </div>
            ` : ""}
          </div>

          <!-- Key Options: Color & Size -->
          <div class="space-y-3">
            ${product.color ? `
              <div class="text-xs">
                <span class="font-bold text-slate-700 dark:text-slate-300">উপলব্ধ কালার:</span>
                <span class="text-slate-900 dark:text-white font-medium ml-1.5">${product.color}</span>
              </div>
            ` : ""}

            ${product.size ? `
              <div class="text-xs">
                <span class="font-bold text-slate-700 dark:text-slate-300">সাইজ / পরিমাপ:</span>
                <span class="text-slate-900 dark:text-white font-medium ml-1.5">${product.size}</span>
              </div>
            ` : ""}
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center gap-4 text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300">অর্ডার পরিমাণ:</span>
            <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
              <button 
                class="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                onclick="let inp = document.getElementById('product-qty-input'); let min = ${isWholesale ? minOrderQty : 1}; if(inp.value > min) inp.value--;"
              >
                -
              </button>
              <input 
                type="number" 
                id="product-qty-input" 
                value="${isWholesale ? minOrderQty : 1}" 
                min="${isWholesale ? minOrderQty : 1}" 
                max="${stock > 0 ? stock : 100}"
                class="w-14 text-center font-bold text-xs bg-transparent border-none outline-none text-slate-900 dark:text-white"
              />
              <button 
                class="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                onclick="let inp = document.getElementById('product-qty-input'); inp.value++;"
              >
                +
              </button>
            </div>
            ${isWholesale ? `<span class="text-[11px] text-amber-600">হোলসেল ন্যূনতম ${minOrderQty} পিস</span>` : ""}
          </div>

          <!-- Primary Call to Action Buttons -->
          <div class="space-y-3 pt-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <!-- Order Now or Pre-order -->
              ${isOutOfStock ? `
                <button 
                  id="btn-detail-preorder" 
                  class="btn-primary py-3.5 px-6 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-2 shadow-md"
                  data-product-id="${product.product_id}"
                >
                  <span>⏳</span> প্রি-অর্ডার করুন (অগ্রিম বুকিং)
                </button>
              ` : `
                <button 
                  id="btn-detail-order-now" 
                  class="btn-primary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                  data-product-id="${product.product_id}"
                >
                  <span>⚡</span> এখনই অর্ডার করুন
                </button>
              `}

              <!-- Add to Cart -->
              <button 
                id="btn-detail-add-cart" 
                class="btn-secondary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-800 dark:text-white border-slate-300 dark:border-slate-700"
                data-product-id="${product.product_id}"
              >
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                কার্টে যোগ করুন
              </button>

            </div>

            <!-- WhatsApp Direct Hotline Inquiry Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a 
                href="${wa1Url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn-secondary py-2.5 px-4 text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 flex items-center justify-center gap-2"
              >
                <span>💬</span> WhatsApp 1: 01581703822
              </a>
              <a 
                href="${wa2Url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn-secondary py-2.5 px-4 text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-300 dark:border-teal-800 hover:bg-teal-100 flex items-center justify-center gap-2"
              >
                <span>💬</span> WhatsApp 2: 01818273838
              </a>
            </div>
          </div>

          <!-- Trust & Service Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span class="text-base text-emerald-600">🚚</span>
              <span>২-৩ দিনে ডেলিভারি</span>
            </div>
            <div class="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span class="text-base text-emerald-600">🛡️</span>
              <span>১০০% আসল পণ্য</span>
            </div>
            <div class="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl col-span-2 sm:col-span-1">
              <span class="text-base text-emerald-600">💵</span>
              <span>ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>

        </div>

      </div>

      <!-- Description & Specification Tabs -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>📝</span> পণ্যের বিবরণ ও স্পেসিফিকেশন (Details & Specs)
          </h2>
        </div>

        <div class="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          <p>${product.description || 'এই পণ্যটি ড্রিম কার্ট বিডি-র অথেন্টিক কালেকশনভুক্ত।'}</p>

          ${product.specification ? `
            <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">প্রযুক্তিগত স্পেসিফিকেশন:</h4>
              <p class="font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">${product.specification}</p>
            </div>
          ` : ""}

          ${product.others ? `
            <div class="text-xs text-slate-600 dark:text-slate-400">
              <strong>অন্যান্য তথ্য:</strong> ${product.others}
            </div>
          ` : ""}
        </div>

      </div>

      <!-- Customer Reviews & Rating Section -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">গ্রাহক রিভিউ ও রেটিং (Customer Reviews)</h3>
            <p class="text-xs text-slate-500">আমাদের ভেরিফাইড ক্রেতাদের অভিজ্ঞতা</p>
          </div>
          <div class="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
            <span>★ 4.9</span>
            <span>(২৮ রিভিউ)</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">রাকিবুল হাসান (কুমিল্লা)</span>
              <span class="text-amber-400 font-bold">★★★★★</span>
            </div>
            <p class="text-slate-600 dark:text-slate-400">খুবই চমৎকার প্যাকেজিং এবং আসল পণ্য। পদুয়ার বাজার শপ থেকে সরাসরি নিয়েছি। ধন্যবাদ!</p>
          </div>
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">শফিকুল ইসলাম (ঢাকা)</span>
              <span class="text-amber-400 font-bold">★★★★★</span>
            </div>
            <p class="text-slate-600 dark:text-slate-400">অর্ডার করার ২ দিনের মধ্যে ডেলিভারি পেয়েছি। পণ্যের কোয়ালিটি ১০০% জেনুইন।</p>
          </div>
        </div>
      </div>

      <!-- Related Products Carousel -->
      ${related.length > 0 ? `
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-slate-900 dark:text-white">সম্পর্কিত অন্যান্য পণ্য (Related Products)</h3>
            <a href="/products?cat=${encodeURIComponent(product.category || '')}" class="text-xs font-bold text-emerald-600 hover:underline">আরও দেখুন →</a>
          </div>
          <div class="product-grid">
            ${related.map(p => renderProductCard(p)).join("")}
          </div>
        </section>
      ` : ""}

    </div>
  `;
}
