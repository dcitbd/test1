/**
 * ============================================================================
 * DREAM CART BD — 10-IMAGE BATCH UPLOADER (ImageUploader.js)
 * ============================================================================
 */

export const ImageUploader = {
  render: (existingImages = []) => {
    const imagesList = Array.isArray(existingImages) ? existingImages : [];

    const slots = Array.from({ length: 10 }).map((_, idx) => {
      const img = imagesList[idx] || null;
      const imgUrl = typeof img === "string" ? img : (img?.image_url || img?.url || "");

      return `
        <div class="relative group h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-2 flex flex-col items-center justify-center overflow-hidden hover:border-brand-500 transition-all">
          ${imgUrl ? `
            <img src="${imgUrl}" alt="Product Image ${idx + 1}" class="w-full h-full object-cover rounded-xl" />
            <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-950/80 text-white text-[9px] font-bold">
              ${idx === 0 ? 'Primary / Thumb' : '#' + (idx + 1)}
            </span>
            <button type="button" class="absolute top-2 right-2 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          ` : `
            <i data-lucide="image-plus" class="w-6 h-6 text-slate-400 group-hover:text-brand-500 mb-1"></i>
            <span class="text-[10px] text-slate-400 font-bold">স্লট ${idx + 1}</span>
            <input type="text" placeholder="ইমেজ URL" class="mt-1 w-full px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-center outline-none text-slate-900 dark:text-white" />
          `}
        </div>
      `;
    }).join("");

    return `
      <div class="space-y-3 font-bengali">
        <p class="text-xs text-slate-500">প্রথম ছবিটি থাম্বনেইল হিসেবে প্রদর্শিত হবে। সর্বোচ্চ ১০টি ইমেজ লিঙ্ক দিতে পারেন:</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          ${slots}
        </div>
      </div>
    `;
  }
};

// গ্লোবাল উইন্ডোতে বাইন্ড করা
if (typeof window !== "undefined") {
  window.ImageUploader = ImageUploader;
}

// Default export যুক্ত করা হয়েছে
export default ImageUploader;
