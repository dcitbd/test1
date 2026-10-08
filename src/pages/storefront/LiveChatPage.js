/**
 * DREAM CART BD — LIVE CHAT & SUPPORT HUB (LiveChatPage.js)
 */

import { apiClient } from '../../api/client.js';

export async function renderLiveChatPage() {
  const prodRes = await apiClient.request("products/list");
  const products = (prodRes.data && prodRes.data.items) || [];

  return `
    <div class="max-w-4xl mx-auto space-y-8 pb-20">
      <div class="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>💬</span> লাইভ চ্যাট ও কাস্টমার সাপোর্ট ডেস্ক (Live Chat)
        </h1>
        <p class="text-xs text-slate-500 mt-1">আমাদের সাপোর্ট প্রতিনিধি ও ডিজিটাল অ্যাসিস্ট্যান্টের সাথে যোগাযোগ করুন</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-[500px] overflow-hidden">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">DC</div>
              <div>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Dream Cart BD সাপোর্ট</h4>
                <div class="text-[10px] text-emerald-600 font-medium">অনলাইন | ইনস্ট্যান্ট রিপ্লাই</div>
              </div>
            </div>
            <span class="badge badge-success text-[10px]">Active</span>
          </div>

          <div id="chat-messages-container" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            <div class="flex items-start gap-2.5 max-w-[85%]">
              <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">🤖</div>
              <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-slate-800 dark:text-slate-200 leading-relaxed">
                আসসালামু আলাইকুম! ড্রিম কার্ট বিডি-তে স্বাগতম। আপনি কোন পণ্যটি সম্পর্কে জানতে চান?
              </div>
            </div>
          </div>

          <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input 
              type="text" 
              id="chat-input"
              placeholder="আপনার বার্তা লিখুন..." 
              class="form-control text-xs flex-1 py-2 px-3.5 rounded-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 outline-none"
              onkeypress="if(event.key === 'Enter') { window.sendChatMessage(this.value); this.value = ''; }"
            />
            <button 
              class="btn-primary p-2 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              onclick="const el = document.getElementById('chat-input'); if(el.value) { window.sendChatMessage(el.value); el.value = ''; }"
            >
              ➤
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
            <h3 class="text-base font-bold text-slate-900 dark:text-white border-b pb-3">📞 সরাসরি হটলাইন</h3>
            <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200">
              <div class="font-bold text-emerald-900 dark:text-emerald-200 mb-1">WhatsApp 1 (মাস্টার):</div>
              <a href="https://wa.me/8801581703822" target="_blank" class="font-mono text-sm font-black text-emerald-700 hover:underline">01581703822</a>
            </div>
            <div class="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200">
              <div class="font-bold text-teal-900 dark:text-teal-200 mb-1">WhatsApp 2 (অর্ডার ডেস্ক):</div>
              <a href="https://wa.me/8801818273838" target="_blank" class="font-mono text-sm font-black text-teal-700 hover:underline">01818273838</a>
            </div>
            <div class="space-y-1 text-slate-600 dark:text-slate-400 pt-2">
              <p>📍 চৌধুরী প্লাজা, পদুয়ার বাজার বিশ্বরোড, কুমিল্লা-৩৫০০।</p>
              <p>✉️ <a href="mailto:jainal.dcitbd@gmail.com" class="text-emerald-600">jainal.dcitbd@gmail.com</a></p>
              <p>⏰ প্রতিদিন সকাল ৮:০০ - রাত ১০:০০</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
