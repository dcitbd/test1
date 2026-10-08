/**
 * DREAM CART BD — OTHERS MARKETPLACE PAGE (OthersMarketPage.js)
 */

export function renderOthersMarketPage() {
  const marketplaces = [
    {
      shop_id: "MKT-DARAZ-01",
      market_name: "Daraz Bangladesh",
      market_logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Daraz_Logo.png",
      shop_name: "Dream Cart BD Official Store",
      shop_link: "https://www.daraz.com.bd/shop/dreamcartbd",
      status: "Active Verified Seller",
      badge: "DarazMall / Top Rated"
    },
    {
      shop_id: "MKT-BIKROY-02",
      market_name: "Bikroy.com",
      market_logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Bikroy.com_logo.png/220px-Bikroy.com_logo.png",
      shop_name: "Dream Cart BD (Cumilla Hub)",
      shop_link: "https://bikroy.com/bn/shops/dreamcartbd",
      status: "Active Authorized Member",
      badge: "Verified Member"
    },
    {
      shop_id: "MKT-FB-03",
      market_name: "Facebook Marketplace & Shop",
      market_logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
      shop_name: "Dream Cart BD Official Page",
      shop_link: "https://www.facebook.com/dreamcartbd",
      status: "Active Blue Verified",
      badge: "50,000+ Followers"
    },
    {
      shop_id: "MKT-BKASH-04",
      market_name: "bKash Merchant Direct Checkout",
      market_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BKash_Logo.svg/200px-BKash_Logo.svg.png",
      shop_name: "J A SAGOR COMPUTER",
      shop_link: "https://shop.bkash.com/j-a-sagor-computer01581703822/paymentlink",
      status: "Active Official Payment Link",
      badge: "Instant 5% Cashback"
    }
  ];

  return `
    <div class="space-y-8 pb-20">
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>🌐</span> অন্যান্য অনলাইন মার্কেটপ্লেসে ড্রিম কার্ট বিডি
        </h1>
        <p class="text-xs text-slate-500 mt-1">দারাজ, বিক্রয় এবং ফেসবুক শপে আমাদের অফিসিয়াল আউটলেটসমূহ</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${marketplaces.map(m => `
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="${m.market_logo}" alt="${m.market_name}" class="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">${m.shop_id}</span>
                <h3 class="text-lg font-black text-slate-900 dark:text-white mt-1">${m.market_name}</h3>
                <div class="text-xs font-bold text-slate-600 dark:text-slate-300">দোকান: ${m.shop_name}</div>
              </div>
            </div>
            <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span class="badge badge-success">${m.status}</span>
              <span class="font-bold text-emerald-600">${m.badge}</span>
            </div>
            <a href="${m.shop_link}" target="_blank" rel="noopener noreferrer" class="btn-primary py-2.5 px-4 text-xs font-bold text-center block w-full">
              মার্কেট শপ ভিজিট করুন ↗
            </a>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
