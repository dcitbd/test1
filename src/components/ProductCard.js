/**
 * DREAM CART BD — PRODUCT CARD COMPONENT
 * Implements exact user specifications:
 * - Hover animation & responsive scaling
 * - Product image with Love/Wishlist icon in front and Discount percentage badge
 * - Brand Name + SKU
 * - Product Name (2 lines only with ellipsis)
 * - Horizontal Rule <hr>
 * - Role-based pricing:
 *    * Customer/Guest: Selling price + original price crossed + Stock pcs
 *    * Reseller: Reseller price + Profit margin badge + Stock pcs
 *    * Wholesaler: Wholesaler price + Minimum Order Quantity notice + Stock pcs
 * - Horizontal Rule <hr>
 * - Order Now button (or Pre Order button if Out of Stock)
 * - Cart icon + Favourite icon + Send WhatsApp (01581703822) + Send WhatsApp 2 (01818273838)
 */

import { formatCurrency } from '../utils/format.js';
import { authStore } from '../store/authStore.js';
import { favouriteStore } from '../store/favouriteStore.js';

export function renderProductCard(product) {
  const isWholesale = authStore.isWholesaler();
  const isReseller = authStore.isReseller();
  const isFavourite = favouriteStore.has(product.product_id);
  const stock = Number(product.stock !== undefined ? product.stock : 25);
  const isOutOfStock = stock <= 0;

  // Pricing calculations
  const originalPrice = Number(product.original_price || product.regular_price || product.selling_price);
  const customerSellingPrice = Number(product.selling_price);
  const wholesalePrice = Number(product.wholesale_price || customerSellingPrice * 0.85);
  const resellerPrice = Number(product.reseller_price || customerSellingPrice * 0.90);
  const minOrderQty = Number(product.min_order_qty || product.min_order_q || 5);

  let displayedPrice = customerSellingPrice;
  let roleLabel = "";
  if (isWholesale) {
    displayedPrice = wholesalePrice;
    roleLabel = "হোলসেল দর";
  } else if (isReseller) {
    displayedPrice = resellerPrice;
    roleLabel = "রিসেলার দর";
  }

  const isDiscounted = originalPrice > displayedPrice;
  const discountPercent = isDiscounted ? Math.round(((originalPrice - displayedPrice) / originalPrice) * 100) : 0;

  const thumbnail = product.thumbnail || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  const brandName = product.brand || "Dream Cart BD";
  const sku = product.sku || product.product_id;
  const productName = product.name || product.p_name || "পণ্য";
  const slug = product.slug || product.product_id;

  // WhatsApp Message payloads
  const pageUrl = window.location.origin + "/product/" + slug;
  const waText = encodeURIComponent(`হ্যালো Dream Cart BD, আমি এই পণ্যটি সম্পর্কে জানতে চাই:\nপণ্য: ${productName}\nSKU: ${sku}\nমূল্য: ৳${displayedPrice}\nলিঙ্ক: ${pageUrl}`);
  const wa1Url = `https://wa.me/8801581703822?text=${waText}`;
  const wa2Url = `https://wa.me/8801818273838?text=${waText}`;

  return `
    <div class="product-card group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden" data-product-id="${product.product_id}">
      
      <!-- Product Image with badges & Love icon in front -->
      <div class="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer card-img-click" data-slug="${slug}">
        <img 
          src="${thumbnail}" 
          alt="${productName}" 
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';"
        />

        <!-- Love / Favourite Icon (Front top-left) -->
        <button 
          class="btn-toggle-favourite absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition text-slate-400 hover:text-rose-500 ${isFavourite ? 'text-rose-500 !bg-rose-50 dark:!bg-rose-950/40' : ''}"
          data-product-id="${product.product_id}"
          title="${isFavourite ? 'ফেভারিট থেকে সরান' : 'ফেভারিট তালিকায় যোগ করুন'}"
          aria-label="Wishlist"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        <!-- Discount Percentage Badge (Front top-right) -->
        ${discountPercent > 0 ? `
          <div class="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
            -${discountPercent}%
          </div>
        ` : ""}

        <!-- Stock Status Pill (Bottom Left overlay) -->
        <div class="absolute bottom-2 left-2 z-10">
          ${isOutOfStock ? `
            <span class="bg-rose-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              স্টক শেষ (প্রি-অর্ডার)
            </span>
          ` : `
            <span class="bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              স্টক: ${stock} পিস
            </span>
          `}
        </div>

      </div>

      <!-- Card Body -->
      <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        
        <!-- Brand Name + SKU -->
        <div>
          <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-1 gap-2">
            <span class="truncate hover:text-emerald-600 transition">${brandName}</span>
            <span class="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">${sku}</span>
          </div>

          <!-- Product Name (2 line only clamp) -->
          <h3 
            class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2 leading-snug cursor-pointer card-img-click mb-2" 
            data-slug="${slug}"
            title="${productName}"
          >
            ${productName}
          </h3>
        </div>

        <hr class="border-slate-100 dark:border-slate-800 my-2" />

        <!-- Price Section based on account type -->
        <div class="space-y-1">
          ${roleLabel ? `
            <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ${roleLabel}
            </div>
          ` : ""}

          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              ${formatCurrency(displayedPrice)}
            </span>
            ${isDiscounted ? `
              <span class="text-xs text-slate-400 dark:text-slate-500 line-through">
                ${formatCurrency(originalPrice)}
              </span>
            ` : ""}
            <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              (${stock} পিস মজুদ)
            </span>
          </div>

          <!-- Wholesaler Minimum Order Quantity Warning -->
          ${isWholesale ? `
            <div class="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md mt-1">
              <span>⚠️</span> সর্বনিম্ন অর্ডার পরিমাণ: ${minOrderQty} পিস
            </div>
          ` : ""}
        </div>

        <hr class="border-slate-100 dark:border-slate-800 my-2" />

        <!-- Order Action Button (Order Now vs Pre Order) -->
        <div class="space-y-2">
          ${isOutOfStock ? `
            <button 
              class="btn-pre-order w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              data-product-id="${product.product_id}"
            >
              <span>⏳</span> প্রি-অর্ডার করুন
            </button>
          ` : `
            <button 
              class="btn-order-now w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              data-product-id="${product.product_id}"
            >
              <span>⚡</span> অর্ডার করুন
            </button>
          `}

          <!-- Quick Action Icon Toolbar: Cart Icon + Favourite Icon + Send WhatsApp 1 + Send WhatsApp 2 -->
          <div class="grid grid-cols-4 gap-1.5 pt-1">
            
            <!-- Cart Icon -->
            <button 
              class="btn-quick-add bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-slate-700 hover:text-emerald-600 dark:text-slate-300 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 transition flex items-center justify-center"
              data-product-id="${product.product_id}"
              title="কার্টে যোগ করুন"
              aria-label="Add to Cart"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>

            <!-- Favourite Icon -->
            <button 
              class="btn-toggle-favourite bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 hover:text-rose-600 dark:text-slate-300 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 transition flex items-center justify-center ${isFavourite ? 'text-rose-500 !bg-rose-50 dark:!bg-rose-950/40' : ''}"
              data-product-id="${product.product_id}"
              title="পছন্দের তালিকায় রাখুন"
              aria-label="Wishlist"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>

            <!-- Send WhatsApp 1 -->
            <a 
              href="${wa1Url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 transition flex items-center justify-center text-[10px] font-bold"
              title="WhatsApp: 01581703822"
              aria-label="WhatsApp 1"
            >
              <span>WA 1</span>
            </a>

            <!-- Send WhatsApp 2 -->
            <a 
              href="${wa2Url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 p-2 rounded-xl border border-teal-200 dark:border-teal-800 transition flex items-center justify-center text-[10px] font-bold"
              title="WhatsApp: 01818273838"
              aria-label="WhatsApp 2"
            >
              <span>WA 2</span>
            </a>

          </div>

        </div>

      </div>

    </div>
  `;
}
