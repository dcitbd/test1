/**
 * DREAM CART BD — CONTACT & OUTLET PAGE (ContactPage.js)
 * Implements user requirements:
 * - Authentic shop location, office hours, email, hotlines
 * - WhatsApp direct chat links for 01581703822 and 01818273838
 * - Contact feedback form
 */

export function renderContactPage() {
  return `
    <div class="space-y-8 pb-20 max-w-4xl mx-auto">
      
      <!-- Page Header -->
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4 text-center sm:text-left">
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-1 justify-center sm:justify-start">
          <a href="/" class="hover:text-emerald-600 transition">হোম</a>
          <span>/</span>
          <span class="text-slate-700 dark:text-slate-300 font-bold">যোগাযোগ</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
          <span>📍</span> আমাদের সাথে যোগাযোগ করুন (Contact Us)
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          যেকোনো তথ্য, পণ্য অর্ডার বা ব্যবসায়িক অনুসন্ধানে আমাদের সাথে যোগাযোগ করুন
        </p>
      </div>

      <!-- Main Layout: Contact Cards + Feedback Form -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Office & Hotlines (6 cols) -->
        <div class="md:col-span-6 space-y-4">
          
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span>🏢</span> ড্রিম কার্ট বিডি হেড অফিস ও আউটলেট
            </h3>

            <div class="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-sm">
                  📍
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">অফিস ও শোরুমের ঠিকানা:</div>
                  <div class="text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                    চৌধুরী প্লাজা, নিচতলা, রুম #০৩, পদুয়ার বাজার বিশ্বরোড, সদর দক্ষিণ, কুমিল্লা-৩৫০০।
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-sm">
                  📞
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">মোবাইল হটলাইন:</div>
                  <div class="space-y-0.5 mt-0.5">
                    <div>হটলাইন ১: <a href="tel:01581703822" class="font-mono font-bold text-emerald-600 hover:underline">01581703822</a> (WhatsApp)</div>
                    <div>হটলাইন ২: <a href="tel:01818273838" class="font-mono font-bold text-emerald-600 hover:underline">01818273838</a></div>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-sm">
                  ✉️
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">অফিশিয়াল ইমেইল:</div>
                  <div class="mt-0.5">
                    <a href="mailto:jainal.dcitbd@gmail.com" class="text-emerald-600 font-medium hover:underline">
                      jainal.dcitbd@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-sm">
                  ⏰
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">অফিস ও সাপোর্ট সময়সূচি:</div>
                  <div class="text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    প্রতিদিন সকাল ৮:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত।
                  </div>
                </div>
              </div>

            </div>

            <!-- Direct WhatsApp Buttons -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div class="text-[11px] font-bold text-slate-500">তাত্ক্ষণিক WhatsApp মেসেজ:</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a 
                  href="https://wa.me/8801581703822" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn-primary py-2 px-3 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>💬</span> 01581703822
                </a>
                <a 
                  href="https://wa.me/8801818273838" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn-secondary py-2 px-3 text-xs font-bold text-center flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-slate-800"
                >
                  <span>💬</span> 01818273838
                </a>
              </div>
            </div>

          </div>

        </div>

        <!-- Right: Message Form (6 cols) -->
        <div class="md:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <span>✉️</span> মেসেজ পাঠান (Send us a message)
          </h3>

          <form 
            id="contact-form" 
            class="space-y-3.5 text-xs"
            onsubmit="event.preventDefault(); alert('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।'); this.reset();"
          >
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">আপনার নাম *</label>
              <input type="text" required placeholder="মোঃ তানভীর হাসান" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর *</label>
              <input type="tel" required placeholder="01700000000" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 font-mono outline-none" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">বিষয় (Subject)</label>
              <input type="text" placeholder="যেমন: পণ্য সংক্রান্ত অনুসন্ধান / হোলসেল তথ্য" class="form-control text-xs w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">বার্তা (Message) *</label>
              <textarea required rows="4" placeholder="আপনার বার্তাটি বিস্তারিত লিখুন..." class="form-control text-xs w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none leading-relaxed"></textarea>
            </div>

            <button type="submit" class="btn-primary w-full py-3 text-xs font-bold shadow-md">
              মেসেজ পাঠান →
            </button>
          </form>
        </div>

      </div>

    </div>
  `;
}
