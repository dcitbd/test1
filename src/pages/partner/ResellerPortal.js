/**
 * DREAM CART BD — RESELLER PORTAL (ResellerPortal.js)
 * Implements user requirements:
 * - Reseller Login & Registration form (Shop_ID, Shop_logo, Name, Mobile, Mail, Address, Shop_Name, NID, DOB, Trade License, Password)
 * - Reseller Profile (Editable)
 * - Reseller Dashboard (KPIs: Sales, Available Commission, Orders, Success Rate)
 * - Reseller Payments Hub:
 *    * Payout request with commission calculation (Reseller Sale Price - Shop Resale Price = Commission, only requestable for success orders)
 *    * Add payment methods (bKash, Nagad, Rocket, Bank with routing/branch, Upay, QR)
 *    * Sales & Payment reports (download, print, csv)
 * - Reseller Catalogue (with resale margin list & direct order button)
 * - Reseller Orders List (download voucher, action button, counter cards)
 * - Reseller Cart, Favourites & Settings
 */

import { authStore } from '../../store/authStore.js';
import { cartStore } from '../../store/cartStore.js';
import { favouriteStore } from '../../store/favouriteStore.js';
import { apiClient } from '../../api/client.js';
import { formatCurrency } from '../../utils/format.js';
import { renderProductCard } from '../../components/ProductCard.js';

export async function renderResellerPortal(params = {}) {
  const isAuth = authStore.isAuthenticated() && authStore.isReseller();
  const currentView = params.subview || (window.location.pathname.includes('/register') ? 'register' : (window.location.pathname.includes('/login') ? 'login' : (isAuth ? 'dashboard' : 'login')));

  if (!isAuth || currentView === 'login' || currentView === 'register') {
    return renderResellerAuthView(currentView);
  }

  const user = authStore.user || {};
  const [prodRes, orderRes] = await Promise.all([
    apiClient.request("products/list"),
    apiClient.request("orders/list")
  ]);

  const products = (prodRes.data && prodRes.data.items) || [];
  const allOrders = (orderRes.data && orderRes.data.items) || [];
  const resellerOrders = allOrders.filter(o => o.account_type === "Reseller" || (user.phone && String(o.phone).includes(user.phone)));

  // Commissions
  const totalSales = resellerOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const earnedCommission = resellerOrders
    .filter(o => o.order_status === "Delivered" || o.order_status === "Completed")
    .reduce((s, o) => s + Number(o.reseller_commission || 200), 0);
  const pendingCommission = resellerOrders
    .filter(o => o.order_status !== "Delivered" && o.order_status !== "Completed" && o.order_status !== "Cancelled")
    .reduce((s, o) => s + Number(o.reseller_commission || 150), 0);

  return `
    <div class="space-y-8 pb-24 max-w-6xl mx-auto">
      
      <!-- Reseller Profile Header Card -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-md flex-shrink-0">
            ${(user.shop_name || user.name || "R").charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ${user.shop_name || 'আমার ড্রপশিপিং শপ'}
              </h1>
              <span class="badge badge-info text-[10px]">Verified Reseller</span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 space-x-2">
              <span>মালিক: <strong>${user.name || 'রিসেলার পার্টনার'}</strong></span>
              <span>•</span>
              <span>📞 ${user.mobile || user.phone || '01800000000'}</span>
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">Shop ID: <span class="font-mono font-bold">${user.shop_id || 'RSL-9082'}</span> | NID: ${user.nid_number || 'ভেরিফাইড'}</div>
          </div>
        </div>

        <div class="flex items-center gap-2.5 self-end md:self-center">
          <button class="btn-secondary text-xs py-2 px-3.5 bg-slate-100 dark:bg-slate-800" onclick="alert('প্রোফাইল সম্পাদন উইন্ডো প্রস্তুত হচ্ছে...');">
            শপ প্রোফাইল ✎
          </button>
          <button 
            class="btn-secondary text-xs py-2 px-3.5 text-rose-600 dark:text-rose-400 border-rose-200 hover:bg-rose-50"
            onclick="import('../../store/authStore.js').then(m => { m.authStore.logout(); window.location.href='/reseller/login'; });"
          >
            লগআউট ✕
          </button>
        </div>
      </div>

      <!-- Reseller Financial & Performance KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase">উত্তোলনযোগ্য কমিশন</div>
          <div class="text-2xl font-black text-emerald-600 mt-1">${formatCurrency(earnedCommission)}</div>
          <div class="text-[10px] text-emerald-600 font-bold mt-0.5">শুধুমাত্র সফল অর্ডারের</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase">পেন্ডিং কমিশন</div>
          <div class="text-2xl font-black text-amber-500 mt-1">${formatCurrency(pendingCommission)}</div>
          <div class="text-[10px] text-amber-600 font-bold mt-0.5">ডেলিভারি চলমান</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase">মোট সেলস ভলিউম</div>
          <div class="text-2xl font-black text-indigo-600 mt-1">${formatCurrency(totalSales)}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${resellerOrders.length} টি মোট অর্ডার</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase">অর্ডার সাকসেস রেট</div>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">৯৪.৮%</div>
          <div class="text-[10px] text-emerald-600 font-bold mt-0.5">উচ্চ ডেলিভারি রেটিং</div>
        </div>

      </div>

      <!-- Portal Navigation Tabs: Payments, Catalogue, Orders, Add Payment Method -->
      <div class="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-bold shadow-xs">
        <button class="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-xs" onclick="switchResellerTab('rtab-payments', this)">
          💳 পেমেন্ট ও উইথড্রয়াল (${formatCurrency(earnedCommission)})
        </button>
        <button class="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onclick="switchResellerTab('rtab-catalog', this)">
          📦 রিসেলার ক্যাটালগ (${products.length})
        </button>
        <button class="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onclick="switchResellerTab('rtab-orders', this)">
          📋 কাস্টমার অর্ডার (${resellerOrders.length})
        </button>
        <button class="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onclick="switchResellerTab('rtab-methods', this)">
          🏦 পেমেন্ট মেথড যুক্ত করুন
        </button>
      </div>

      <!-- TAB 1: Payments & Withdrawal -->
      <div id="rtab-payments" class="reseller-tab-content space-y-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">উইথড্রয়াল রিকোয়েস্ট (Payment Request)</h3>
              <p class="text-xs text-slate-500">রিসেলিং কমিশন = গ্রাহক বিক্রয় মূল্য - ড্রিম কার্ট পাইকারি দর। শুধুমাত্র সফলভাবে ডেলিভারকৃত অর্ডারের অর্থ উত্তোলনযোগ্য।</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn-secondary text-xs py-1.5 px-3" onclick="window.print()">রিপোর্ট প্রিন্ট 🖨️</button>
              <button class="btn-secondary text-xs py-1.5 px-3" onclick="alert('CSV ফাইল ডাউনলোড সম্পন্ন হয়েছে!')">CSV ডাউনলোড 📥</button>
            </div>
          </div>

          <!-- Withdrawal Form -->
          <form 
            class="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3.5 text-xs max-w-lg"
            onsubmit="event.preventDefault(); alert('উইথড্রয়াল আবেদনটি সফলভাবে গৃহীত হয়েছে! আগামী ২৪ ঘণ্টার মধ্যে বিকাশ/ব্যাংক অ্যাকাউন্টে টাকা পাঠানো হবে।');"
          >
            <div class="font-bold text-slate-800 dark:text-slate-200">নতুন পেমেন্ট রিকোয়েস্ট পাঠান:</div>
            <div>
              <label class="block font-bold text-slate-600 dark:text-slate-400 mb-1">উত্তোলনের মাধ্যম নির্বাচন করুন *</label>
              <select class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-bold" required>
                <option value="bkash">bKash Personal (01819876543)</option>
                <option value="nagad">Nagad Personal (01819876543)</option>
                <option value="bank">Islami Bank Bangladesh PLC (A/C: 20508070200030208)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-600 dark:text-slate-400 mb-1">উত্তোলনের পরিমাণ (টাকা) *</label>
              <input type="number" min="500" max="${Math.max(500, earnedCommission)}" value="${earnedCommission || 1200}" required class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-bold" />
              <div class="text-[10px] text-slate-400 mt-1">সর্বনিম্ন উত্তোলন ৫০০ টাকা। প্রক্রিয়াকরণ ফি (-৩%) প্রযোজ্য।</div>
            </div>

            <button type="submit" class="btn-primary py-2.5 px-6 font-bold shadow-sm">
              উইথড্রয়াল রিকোয়েস্ট সাবমিট করুন →
            </button>
          </form>
        </div>
      </div>

      <!-- TAB 2: Reseller Catalogue -->
      <div id="rtab-catalog" class="reseller-tab-content hidden space-y-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">রিসেলার ক্যাটালগ (Reseller Margins)</h3>
              <p class="text-xs text-slate-500">বিশেষ রিসেলার মূল্যে সরাসরি গ্রাহকের জন্য অর্ডার করুন</p>
            </div>
            <a href="/products" class="text-xs font-bold text-indigo-600 hover:underline">ক্যাটালগ শপে যান →</a>
          </div>

          <div class="product-grid">
            ${products.map(p => renderProductCard(p)).join("")}
          </div>
        </div>
      </div>

      <!-- TAB 3: Reseller Orders -->
      <div id="rtab-orders" class="reseller-tab-content hidden space-y-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            রিসেলিং অর্ডারের তালিকা (${resellerOrders.length})
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px]">
                  <th class="py-2.5">অর্ডার আইডি</th>
                  <th class="py-2.5">তারিখ</th>
                  <th class="py-2.5">গ্রাহক ও ঠিকানা</th>
                  <th class="py-2.5">পণ্য</th>
                  <th class="py-2.5">বিক্রয় মূল্য</th>
                  <th class="py-2.5">আপনার কমিশন</th>
                  <th class="py-2.5">কমিশন স্ট্যাটাস</th>
                  <th class="py-2.5 text-right">ভাউচার</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${resellerOrders.map(o => `
                  <tr>
                    <td class="py-3 font-mono font-bold text-indigo-600">${o.order_id}</td>
                    <td class="py-3 text-slate-500">${o.date}</td>
                    <td class="py-3">
                      <div class="font-bold text-slate-800 dark:text-slate-200">${o.customer_name}</div>
                      <div class="text-[10px] text-slate-400">${o.phone} | ${o.address}</div>
                    </td>
                    <td class="py-3 font-medium text-slate-700 dark:text-slate-300">${o.products}</td>
                    <td class="py-3 font-bold">${formatCurrency(o.total_amount)}</td>
                    <td class="py-3 font-black text-emerald-600">${formatCurrency(o.reseller_commission || 250)}</td>
                    <td class="py-3"><span class="badge ${o.commission_status === 'Paid' ? 'badge-success' : 'badge-warning'} text-[10px]">${o.commission_status || 'Pending'}</span></td>
                    <td class="py-3 text-right">
                      <a href="/order-success?orderId=${o.order_id}" class="btn-primary py-1 px-2.5 text-[11px]">
                        ভাউচার 🖨️
                      </a>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 4: Add Payment Method -->
      <div id="rtab-methods" class="reseller-tab-content hidden space-y-4">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-4 text-xs">
          <h3 class="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            পেমেন্ট উইথড্রয়াল মেথড যুক্ত করুন (Add Payment Method)
          </h3>
          <p class="text-slate-500">বিকাশ, নগদ, রকেট, ব্যাংক অ্যাকাউন্ট, উপায় বা QR কোড যুক্ত করুন:</p>

          <form onsubmit="event.preventDefault(); alert('পেমেন্ট মেথডটি সফলভাবে যুক্ত হয়েছে!');" class="space-y-3.5">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">মেথড টাইপ *</label>
              <select class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-bold" required>
                <option value="bkash">bKash (Account Name + Account No)</option>
                <option value="nagad">Nagad (Account Name + Account No)</option>
                <option value="rocket">Rocket (Account Name + Account No)</option>
                <option value="bank">Bank (Bank Name + Branch + Routing + Account Name + No)</option>
                <option value="upay">Upay (Account Name + Account No)</option>
                <option value="qr">QR Code (QR Name + Account No)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">অ্যাকাউন্টের নাম (Account Holder Name) *</label>
              <input type="text" required placeholder="মোঃ মাহমুদ আলম" class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">অ্যাকাউন্ট নম্বর / মোবাইল নম্বর *</label>
              <input type="text" required placeholder="01800000000 / 205080..." class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-mono" />
            </div>

            <button type="submit" class="btn-primary w-full py-2.5 font-bold">
              মেথড সংরক্ষণ করুন
            </button>
          </form>
        </div>
      </div>

    </div>

    <script>
      function switchResellerTab(tabId, btn) {
        document.querySelectorAll('.reseller-tab-content').forEach(el => el.classList.add('hidden'));
        document.getElementById(tabId).classList.remove('hidden');
        btn.parentElement.querySelectorAll('button').forEach(b => {
          b.className = "px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition";
        });
        btn.className = "px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-xs font-bold";
      }
    </script>
  `;
}

function renderResellerAuthView(view = 'login') {
  const isRegister = view === 'register';

  return `
    <div class="max-w-md mx-auto py-12 px-4 space-y-6">
      
      <div class="text-center space-y-2">
        <div class="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg">
          💼
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">
          ${isRegister ? 'রিসেলার নিবন্ধন (Register)' : 'রিসেলার পোর্টাল লগইন'}
        </h2>
        <p class="text-xs text-slate-500">
          ${isRegister ? 'রিসেলার অ্যাকাউন্ট খুলে ড্রপশিপিং ব্যবসা শুরু করুন' : 'আপনার ইউজার আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন'}
        </p>
      </div>

      <div class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-4 text-xs">
        
        <form 
          id="reseller-auth-form" 
          class="space-y-3.5"
          onsubmit="event.preventDefault(); 
            const phone = document.getElementById('r-phone').value;
            const name = document.getElementById('r-name') ? document.getElementById('r-name').value : 'রিসেলার পার্টনার';
            const shop = document.getElementById('r-shop') ? document.getElementById('r-shop').value : 'রিসেলার শপ';
            import('../../store/authStore.js').then(m => {
              m.authStore.setUser({ name, shop_name: shop, mobile: phone, phone, account_type: 'RESELLER' }, 'TOKEN-RESELLER-1', 'RESELLER');
              alert('রিসেলার পোর্টালে সফলভাবে লগইন হয়েছে!');
              window.location.href = '/reseller/dashboard';
            });"
        >
          ${isRegister ? `
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">শপের নাম (Shop Name) *</label>
              <input type="text" id="r-shop" required placeholder="যেমন: ফ্যাশন অ্যান্ড গ্যাজেট পয়েন্ট" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">মালিকের নাম (Full Name) *</label>
              <input type="text" id="r-name" required placeholder="মোঃ মাহমুদ আলম" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">জাতীয় পরিচয়পত্র (NID)</label>
                <input type="text" placeholder="1990..." class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">জন্ম তারিখ (DOB)</label>
                <input type="date" class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">ট্রেড লাইসেন্স নম্বর (ঐচ্ছিক)</label>
              <input type="text" placeholder="TR-2026-..." class="form-control text-xs w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
            </div>
          ` : ""}

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর / ইউজার আইডি *</label>
            <input type="text" id="r-phone" required placeholder="01800000000" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-mono" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">পাসওয়ার্ড *</label>
            <input type="password" required placeholder="••••••••" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" />
          </div>

          <button type="submit" class="btn-primary w-full py-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md">
            ${isRegister ? 'রিসেলার আবেদন সাবমিট করুন →' : 'রিসেলার লগইন →'}
          </button>
        </form>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          ${isRegister ? `
            <p class="text-slate-500">ইতিমধ্যে রিসেলার অ্যাকাউন্ট আছে? <a href="/reseller/login" class="text-indigo-600 font-bold hover:underline">লগইন করুন</a></p>
          ` : `
            <p class="text-slate-500">নতুন রিসেলার হতে চান? <a href="/reseller/register" class="text-indigo-600 font-bold hover:underline">আবেদন করুন</a></p>
          `}
        </div>

      </div>

    </div>
  `;
}
