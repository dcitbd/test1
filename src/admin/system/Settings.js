/**
 * DREAM CART BD — ADMIN SYSTEM SETTINGS
 * Central administrative dashboard module showing active store profile,
 * payment accounts, delivery rates, discount rules, and system developer profile.
 */

export function renderSettings() {
  return `
    <div class="space-y-8 max-w-5xl mx-auto">
      
      <!-- Section Header -->
      <div class="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <span class="badge badge-info text-xs">Store Configuration</span>
          <h2 class="text-2xl font-black text-slate-900 mt-1">System Settings & Store Profile</h2>
          <p class="text-xs text-slate-500">Real-time configuration synced across storefront, API gateway, and Google Sheets.</p>
        </div>
        <button class="btn-primary text-xs py-2 px-4 shadow-sm" onclick="alert('Settings saved and synchronized with Google Sheets!')">
          Save Changes
        </button>
      </div>

      <!-- Store General Information -->
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span class="text-emerald-600">🏪</span> সাধারণ দোকান তথ্য (General Store Information)
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">দোকানের নাম (Shop Name)</label>
            <input type="text" value="Dream Cart BD" class="form-control text-xs font-bold text-slate-900 bg-slate-50" readonly />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">অফিস সময় (Office Hours)</label>
            <input type="text" value="Every Day 8:00 AM to 10:00 PM" class="form-control text-xs text-slate-800 bg-slate-50" readonly />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">স্বত্বাধিকারী ১ (Shop Owner 1)</label>
            <input type="text" value="Jainal Abedin" class="form-control text-xs text-slate-800 bg-slate-50" readonly />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">স্বত্বাধিকারী ২ (Shop Owner 2)</label>
            <input type="text" value="MD. Saiful Islam" class="form-control text-xs text-slate-800 bg-slate-50" readonly />
          </div>

          <div class="md:col-span-2">
            <label class="font-bold text-slate-700 block mb-1">দোকানের ঠিকানা (Shop Address)</label>
            <textarea class="form-control text-xs text-slate-800 bg-slate-50" rows="2" readonly>Chawdhury Plaza, ground floor, room#03, Paduar Bazar, Bishwa Road, Sadar Dakshin, Cumilla-3500.</textarea>
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">হটলাইন ১ (WhatsApp)</label>
            <input type="text" value="01581703822" class="form-control text-xs font-mono text-slate-800 bg-slate-50" readonly />
          </div>

          <div>
            <label class="font-bold text-slate-700 block mb-1">হটলাইন ২ (WhatsApp)</label>
            <input type="text" value="01818273838" class="form-control text-xs font-mono text-slate-800 bg-slate-50" readonly />
          </div>
        </div>
      </div>

      <!-- Delivery Zones & Rates -->
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span class="text-emerald-600">🚚</span> ডেলিভারি জোন ও চার্জ (Delivery Rates & Free Shipping Rule)
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-slate-500 font-bold">In Cumilla</span>
            <div class="text-xl font-black text-emerald-600">৳70</div>
            <p class="text-[11px] text-slate-400">কুমিল্লা সদর এলাকা</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-slate-500 font-bold">In Dhaka</span>
            <div class="text-xl font-black text-emerald-600">৳90</div>
            <p class="text-[11px] text-slate-400">ঢাকা সিটি কর্পোরেশন</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-slate-500 font-bold">Out of Dhaka</span>
            <div class="text-xl font-black text-emerald-600">৳120</div>
            <p class="text-[11px] text-slate-400">সারা বাংলাদেশ</p>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span class="text-emerald-800 font-bold">Office Pickup</span>
            <div class="text-xl font-black text-emerald-700">৳0 Free</div>
            <p class="text-[11px] text-emerald-600">চৌধুরী প্লাজা, পদুয়ার বাজার</p>
          </div>
        </div>

        <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold">
          🎉 সক্রিয় ফ্রি শিপিং পলিসি: ২০০০ টাকার বেশি শপিং করলে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (৳০)!
        </div>
      </div>

      <!-- Payment Accounts Configuration -->
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span class="text-emerald-600">💳</span> পেমেন্ট গেটওয়ে ও অ্যাকাউন্ট সেটিংস
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-3 rounded-2xl border border-pink-200 bg-pink-50/60">
            <div class="font-bold text-pink-700">bKash Merchant Payment</div>
            <div class="font-mono font-black text-slate-900 text-sm mt-1">01581703822</div>
            <div class="text-[11px] text-slate-500 mt-1">Link: https://shop.bkash.com/j-a-sagor-computer01581703822/paymentlink</div>
          </div>

          <div class="p-3 rounded-2xl border border-pink-200 bg-pink-50/60">
            <div class="font-bold text-pink-700">bKash Personal (Send Money)</div>
            <div class="font-mono font-black text-slate-900 text-sm mt-1">01879653143</div>
            <div class="text-[11px] text-slate-500 mt-1">Personal account for customer send money</div>
          </div>

          <div class="p-3 rounded-2xl border border-orange-200 bg-orange-50/60">
            <div class="font-bold text-orange-700">Nagad Personal (Send Money)</div>
            <div class="font-mono font-black text-slate-900 text-sm mt-1">01879653143</div>
            <div class="text-[11px] text-slate-500 mt-1">Personal wallet number</div>
          </div>

          <div class="p-3 rounded-2xl border border-purple-200 bg-purple-50/60">
            <div class="font-bold text-purple-700">Rocket Personal (Send Money)</div>
            <div class="font-mono font-black text-slate-900 text-sm mt-1">01581703822</div>
            <div class="text-[11px] text-slate-500 mt-1">Personal DBBL Rocket number</div>
          </div>

          <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50 md:col-span-2 space-y-1 font-mono text-[11px]">
            <div class="text-xs font-bold text-slate-900 font-sans">Bank Account Information (Islami Bank Bangladesh PLC)</div>
            <div>A/C Name: <strong>Jainal Abedin</strong></div>
            <div>A/C Number: <strong class="text-emerald-800 text-xs">20508070200030208</strong></div>
            <div>Branch: <strong>Maheshkhali Sub branch</strong> (Routing: 125260525)</div>
            <div>Swift: <strong>IBBLBDDH</strong></div>
          </div>
        </div>

        <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold">
          🔥 অনলাইন পেমেন্ট ইনসেন্টিভ: যেকোনো অনলাইন পেমেন্ট মেথডে অর্ডারে ৫% স্বয়ংক্রিয় ডিসকাউন্ট সক্রিয়।
        </div>
      </div>

      <!-- Developer Credentials Card -->
      <div class="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
        <h3 class="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span class="text-emerald-400">💻</span> ডেভেলপার তথ্য (Developer & Technology Credentials)
        </h3>

        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-xs">
          <img 
            src="https://scontent.fdac24-5.fna.fbcdn.net/v/t39.99422-6/748763443_1355179329312781_3762544494183960829_n.png?stp=dst-jpg_tt6&cstp=mx876x1414&ctp=s876x1414&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEgpskzgAVWN3ZiohXZA-RhiddumrjTx6WJ126auNPHpRbk_pIDiYLXfo5UR9FYrkKKGwNHxgicb8fdqAfCdAzm&_nc_ohc=ulolVsVxolUQ7kNvwFbbn_s&_nc_oc=Adqwy7DrnjEKjOAfZPttbAGnlBGmXslovULfm4dCZditFerwrSiULyvnQBwCwT-ctOY&_nc_zt=14&_nc_ht=scontent.fdac24-5.fna&_nc_gid=QjQg-WZiaHQGDcl9YGAVCA&_nc_ss=7b2a8&oh=00_AQOthzROIPmAhM-IMyLs5b5IxRzmoCsj5_Ucs02h26YSdw&oe=6AC34270" 
            alt="Jainal Abedin" 
            class="w-16 h-16 rounded-2xl object-cover border border-emerald-500 shadow-md"
            onerror="this.style.display='none'"
          />
          <div class="space-y-1.5 flex-1">
            <div class="text-base font-black text-white">Jainal Abedin</div>
            <div class="text-emerald-400 font-bold">CEO, Dream Career IT BD</div>
            <p class="text-slate-300 text-[11px] leading-relaxed">
              Lead Software Engineer & Cloud Solutions Architect. System creator of Dream Cart BD.
            </p>
            <div class="flex flex-wrap gap-4 pt-1">
              <a href="https://dcitbd.github.io/Jainal-Abedin/" target="_blank" class="text-emerald-400 hover:underline">
                🌐 Developer Portfolio
              </a>
              <a href="https://dcitbd.github.io/dcitbd/" target="_blank" class="text-emerald-400 hover:underline">
                🏢 Dream Career IT BD
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}
