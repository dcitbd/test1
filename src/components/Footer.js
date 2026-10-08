/**
 * DREAM CART BD — FOOTER COMPONENT
 * Implements user requirements:
 * - logo + shop name + slogan + description + social icon
 * - Pages (All pages link in two columns)
 * - Shop location + contact + office time
 * - We accept payment method by card / mobile banking badges
 * - developer + terms + privacy + copyright
 * - Fully responsive for mobile, tablet, laptop, desktop, and TV
 */

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors pt-12 pb-16 relative overflow-hidden">
      
      <!-- Top Decorative Accent -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          <!-- Column 1: Logo + Shop Name + Slogan + Description + Social Icons -->
          <div class="space-y-4">
            <a href="/" class="flex items-center gap-3 group">
              <div class="w-12 h-12 rounded-xl bg-white p-1 border border-slate-700 shadow-md flex items-center justify-center overflow-hidden">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10" 
                  alt="Dream Cart BD Logo" 
                  class="w-full h-full object-contain rounded-lg"
                  onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10';"
                />
              </div>
              <div>
                <h3 class="text-xl font-black text-white tracking-tight">Dream Cart <span class="text-emerald-400">BD</span></h3>
                <p class="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Smart Digital Commerce</p>
              </div>
            </a>

            <p class="text-xs text-slate-400 leading-relaxed">
              সরাসরি অথেন্টিক ইম্পোর্টারদের কাছ থেকে সংগৃহীত প্রিমিয়াম স্মার্টওয়াচ, অরগানিক হেলথ ফুড ও নিত্যপ্রয়োজনীয় ইলেকট্রনিক্স গ্যাজেট। সমগ্র বাংলাদেশে নির্ভরযোগ্য ক্যাশ অন ডেলিভারি।
            </p>

            <!-- Slogan Badge -->
            <div class="inline-block bg-slate-900 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full">
              ✨ Smart Digital Commerce for Modern Living
            </div>

            <!-- Social Icons -->
            <div class="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition border border-slate-800" title="Facebook">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="https://wa.me/8801581703822" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition border border-slate-800" title="WhatsApp 1">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.636-.363-.984-.407-1.89-1.282-2.39-2.029-.499-.747-.58-1.468-.58-1.865 0-.417.208-.667.348-.823.14-.156.312-.195.416-.195.104 0 .208.001.299.006.104.005.234-.04.364.271.144.348.49 1.196.532 1.281.042.085.069.185.014.296-.055.111-.083.18-.166.277-.083.097-.175.217-.25.291-.083.084-.17.175-.073.342.097.167.433.714.929 1.155.639.569 1.177.745 1.344.828.167.084.263.07.361-.042.097-.111.416-.486.527-.652.111-.167.222-.139.375-.083.153.055.97.458 1.137.541.167.083.277.125.319.194.042.07.042.404-.102.809z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition border border-slate-800" title="YouTube">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://dcitbd.github.io/dcitbd/" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition border border-slate-800" title="Dream Career IT BD">
                <span class="text-xs font-black text-emerald-400">DC</span>
              </a>
            </div>
          </div>

          <!-- Column 2 & 3: Pages in Two Columns -->
          <div class="lg:col-span-2">
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              গুরুত্বপূর্ণ পেজসমূহ (Pages)
            </h4>
            
            <div class="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-400">
              <!-- Left Sub-column -->
              <div class="space-y-2">
                <a href="/" class="block hover:text-emerald-400 transition">🏠 হোম পেজ (Home)</a>
                <a href="/products" class="block hover:text-emerald-400 transition">🛍️ সকল পণ্য (Products)</a>
                <a href="/categories" class="block hover:text-emerald-400 transition">📂 ক্যাটাগরি সমূহ (Categories)</a>
                <a href="/brands" class="block hover:text-emerald-400 transition">🏷️ ব্র্যান্ড সমূহ (Brands)</a>
                <a href="/cart" class="block hover:text-emerald-400 transition">🛒 শপিং কার্ট (Cart)</a>
                <a href="/favourite" class="block hover:text-emerald-400 transition">❤️ পছন্দের তালিকা (Wishlist)</a>
                <a href="/checkout" class="block hover:text-emerald-400 transition">📝 অর্ডার ফর্ম (Checkout)</a>
                <a href="/track" class="block hover:text-emerald-400 transition">🚚 অর্ডার ট্র্যাকিং (Tracking)</a>
              </div>

              <!-- Right Sub-column -->
              <div class="space-y-2">
                <a href="/offers" class="block hover:text-emerald-400 transition">🎁 স্পেশাল অফার (Offers)</a>
                <a href="/chat" class="block hover:text-emerald-400 transition">💬 লাইভ চ্যাট সাপোর্ট (Live Chat)</a>
                <a href="/others-market" class="block hover:text-emerald-400 transition">🌐 অন্যান্য মার্কেট (Others Market)</a>
                <a href="/landing" class="block hover:text-emerald-400 transition">🚀 ক্যাম্পেইন ল্যান্ডিং পেজ</a>
                <a href="/customer/login" class="block hover:text-emerald-400 transition">👤 কাস্টমার পোর্টাল (Login)</a>
                <a href="/reseller/login" class="block hover:text-emerald-400 transition">💼 রিসেলার হাব (Reseller)</a>
                <a href="/wholesaler/login" class="block hover:text-emerald-400 transition">📦 হোলসেলার হাব (Wholesale)</a>
                <a href="/admin/login" class="block hover:text-emerald-400 transition">⚙️ অ্যাডমিন পোর্টাল (Admin)</a>
              </div>
            </div>
          </div>

          <!-- Column 4: Shop Location + Contact + Office Time -->
          <div class="space-y-3.5 text-xs text-slate-400">
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              যোগাযোগ ও অফিস
            </h4>

            <div class="flex items-start gap-2.5">
              <span class="text-base text-emerald-400">📍</span>
              <p class="leading-relaxed">
                চৌধুরী প্লাজা, নিচতলা, রুম #০৩, পদুয়ার বাজার বিশ্বরোড, সদর দক্ষিণ, কুমিল্লা-৩৫০০।
              </p>
            </div>

            <div class="flex items-center gap-2.5">
              <span class="text-base text-emerald-400">📞</span>
              <div>
                <p>হটলাইন: <a href="tel:01581703822" class="text-white hover:text-emerald-400 font-bold">01581703822</a></p>
                <p>সাপোর্ট: <a href="tel:01818273838" class="text-white hover:text-emerald-400 font-bold">01818273838</a></p>
              </div>
            </div>

            <div class="flex items-center gap-2.5">
              <span class="text-base text-emerald-400">✉️</span>
              <p>ইমেইল: <a href="mailto:jainal.dcitbd@gmail.com" class="text-white hover:text-emerald-400">jainal.dcitbd@gmail.com</a></p>
            </div>

            <div class="flex items-center gap-2.5">
              <span class="text-base text-emerald-400">⏰</span>
              <p>অফিস সময়: <strong class="text-white">প্রতিদিন সকাল ৮:০০ - রাত ১০:০০</strong></p>
            </div>
          </div>

        </div>

        <!-- We Accept Payment Methods Section -->
        <div class="py-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>🛡️ নিরাপদ পেমেন্ট মেথড (We Accept):</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-emerald-400">ক্যাশ অন ডেলিভারি (COD)</span>
            <span class="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-pink-400">bKash Personal & Payment</span>
            <span class="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-orange-400">Nagad</span>
            <span class="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-purple-400">Rocket</span>
            <span class="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-blue-400">Bank Transfer (IBBL)</span>
            <span class="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-amber-400">Visa / Mastercard</span>
          </div>
        </div>

        <!-- Bottom Bar: Developer + Terms + Privacy + Copyrights -->
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; ${currentYear} <strong>Dream Cart BD</strong>. সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div class="flex items-center gap-4 text-xs">
            <a href="/terms" class="hover:text-slate-300 transition">Terms & Conditions</a>
            <span>•</span>
            <a href="/privacy" class="hover:text-slate-300 transition">Privacy Policy</a>
          </div>

          <!-- Developer Credit -->
          <div class="flex items-center gap-1.5 text-slate-400">
            <span>Developer:</span>
            <a 
              href="https://dcitbd.github.io/Jainal-Abedin/" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-emerald-400 font-bold hover:underline"
            >
              Jainal Abedin
            </a>
            <span>(CEO,</span>
            <a 
              href="https://dcitbd.github.io/dcitbd/" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-emerald-400 font-bold hover:underline"
            >
              Dream Career IT BD
            </a>
            <span>)</span>
          </div>

        </div>

      </div>
    </footer>
  `;
}
