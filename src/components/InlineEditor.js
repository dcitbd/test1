/**
 * ============================================================================
 * DREAM CART BD — INLINE CELL EDITOR (InlineEditor.js)
 * Enables zero-refresh Price & Stock updates straight to Google Sheets
 * ============================================================================
 */

import { ProductAPI } from "../api/products.js";
import { store } from "../js/store.js";

export const InlineEditor = {
  // প্রাইস ইনলাইন এডিটর রেন্ডারার
  renderPriceCell: (productId, currentPrice, priceType = "selling_price") => {
    return `
      <div class="inline-edit-wrapper flex items-center gap-1.5 group cursor-pointer" data-product-id="${productId}" data-type="price" data-price-type="${priceType}">
        <span class="cell-value font-bold text-slate-900 dark:text-white">৳${currentPrice}</span>
        <button type="button" class="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-brand-600 transition-opacity">
          <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  },

  // স্টক ইনলাইন এডিটর রেন্ডারার
  renderStockCell: (productId, currentStock) => {
    const numStock = Number(currentStock) || 0;
    const stockClass = numStock <= 5 ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300 font-semibold';
    return `
      <div class="inline-edit-wrapper flex items-center gap-1.5 group cursor-pointer" data-product-id="${productId}" data-type="stock">
        <span class="cell-value ${stockClass}">${numStock}</span>
        <button type="button" class="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-brand-600 transition-opacity">
          <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  },

  // ইনলাইন এডিটর ইভেন্ট লিসেনার
  attachListeners: (containerElement) => {
    if (!containerElement || typeof containerElement.querySelectorAll !== "function") return;

    containerElement.querySelectorAll(".inline-edit-wrapper").forEach(wrapper => {
      wrapper.addEventListener("click", function() {
        if (this.querySelector("input")) return; // অলরেডি এডিট মোডে থাকলে রিটার্ন

        const productId = this.dataset.productId;
        const type = this.dataset.type;
        const priceType = this.dataset.priceType || "selling_price";
        const cellValueEl = this.querySelector(".cell-value");
        const currentValue = cellValueEl ? cellValueEl.innerText.replace("৳", "").trim() : "";

        this.innerHTML = `
          <div class="flex items-center gap-1">
            <input type="number" class="w-20 px-2 py-1 text-xs border border-brand-500 rounded-lg outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="${currentValue}" autofocus />
            <button type="button" class="save-inline p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"><i data-lucide="check" class="w-3 h-3"></i></button>
            <button type="button" class="cancel-inline p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"><i data-lucide="x" class="w-3 h-3"></i></button>
          </div>
        `;
        if (typeof window !== "undefined" && window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
        }

        const input = this.querySelector("input");
        const saveBtn = this.querySelector(".save-inline");
        const cancelBtn = this.querySelector(".cancel-inline");

        const cancel = () => {
          if (type === "price") {
            this.outerHTML = InlineEditor.renderPriceCell(productId, currentValue, priceType);
          } else {
            this.outerHTML = InlineEditor.renderStockCell(productId, currentValue);
          }
          if (typeof window !== "undefined" && window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
          }
          // নতুন রেন্ডার হওয়া এলিমেন্টে পুনরায় লিসেনার যুক্ত করা
          if (containerElement) InlineEditor.attachListeners(containerElement);
        };

        if (cancelBtn) {
          cancelBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            cancel();
          });
        }

        if (saveBtn && input) {
          saveBtn.addEventListener("click", async (ev) => {
            ev.stopPropagation();
            const newValue = input.value.trim();
            if (!newValue || newValue === currentValue) {
              cancel();
              return;
            }

            try {
              saveBtn.innerHTML = `<span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>`;
              if (type === "price") {
                if (ProductAPI && typeof ProductAPI.updatePrice === "function") {
                  await ProductAPI.updatePrice(productId, newValue, priceType);
                }
                if (store && typeof store.showToast === "function") {
                  store.showToast(`মূল্য ৳${newValue}-এ আপডেট হয়েছে!`, "success");
                }
                this.outerHTML = InlineEditor.renderPriceCell(productId, newValue, priceType);
              } else {
                if (ProductAPI && typeof ProductAPI.updateStock === "function") {
                  await ProductAPI.updateStock(productId, newValue);
                }
                if (store && typeof store.showToast === "function") {
                  store.showToast(`স্টক ${newValue}-এ আপডেট হয়েছে!`, "success");
                }
                this.outerHTML = InlineEditor.renderStockCell(productId, newValue);
              }

              if (typeof window !== "undefined" && window.lucide && typeof window.lucide.createIcons === "function") {
                window.lucide.createIcons();
              }
              // নতুন রেন্ডার হওয়া এলিমেন্টে পুনরায় লিসেনার যুক্ত করা
              if (containerElement) InlineEditor.attachListeners(containerElement);
            } catch (err) {
              if (store && typeof store.showToast === "function") {
                store.showToast(`আপডেট ব্যর্থ: ${err.message || "ত্রুটি ঘটেছে"}`, "danger");
              }
              cancel();
            }
          });
        }
      });
    });
  }
};

// গ্লোবাল উইন্ডোতে বাইন্ড করা
if (typeof window !== "undefined") {
  window.InlineEditor = InlineEditor;
}

// Default export যুক্ত করা হয়েছে
export default InlineEditor;
