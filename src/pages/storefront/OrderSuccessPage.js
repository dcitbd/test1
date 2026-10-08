/**
 * DREAM CART BD — ORDER SUCCESS PAGE (OrderSuccessPage.js)
 * Implements user requirements:
 * - Wonderful order success card with order details and Order ID
 * - Remind with WhatsApp (01581703822 and 01818273838)
 * - Print or Download Voucher button
 * - Embedded official invoice voucher with barcode and watermark
 */

import { apiClient } from '../../api/client.js';
import { formatCurrency } from '../../utils/format.js';
import { renderVoucher } from '../../components/Voucher.js';

export async function renderOrderSuccessPage(orderId = "ORD-2609-8472") {
  const res = await apiClient.request("orders/get", { orderId: orderId });
  const order = res.data || {
    order_id: orderId,
    customer_name: "সম্মানিত গ্রাহক",
    phone: "01700000000",
    address: "ঢাকা, বাংলাদেশ",
    payment_method: "Cash On Delivery (COD)",
    payment_status: "COD",
    order_status: "Order Confirmed",
    total_amount: 18500,
    date: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    items: [
      { name: "Amazfit GTS 4 Smartwatch", sku: "AMZ-GTS4-BLK", quantity: 1, price: 18500 }
    ]
  };

  const waReminder1 = `https://wa.me/8801581703822?text=${encodeURIComponent(`Hello Dream Cart BD, I placed order ${orderId} (${formatCurrency(order.total_amount)}). Please confirm shipment.`)}`;
  const waReminder2 = `https://wa.me/8801818273838?text=${encodeURIComponent(`Hello Dream Cart BD, I placed order ${orderId} (${formatCurrency(order.total_amount)}). Please confirm shipment.`)}`;

  return `
    <div class="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      
      <!-- Top Success Announcement Banner -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-500/40 p-6 sm:p-8 text-center space-y-4 shadow-xl print:hidden">
        
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-glow">
          ✓
        </div>

        <div>
          <span class="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            অর্ডার সফলভাবে সম্পন্ন হয়েছে
          </span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে।
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
            আপনার অর্ডার আইডি: <strong class="font-mono text-emerald-700 dark:text-emerald-400 font-black text-base">${orderId}</strong>
          </p>
        </div>

        <!-- WhatsApp Quick Confirm Toolbar -->
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 max-w-md mx-auto space-y-2">
          <div class="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            💬 দ্রুত ডেলিভারির জন্য হোয়াটসঅ্যাপে মেসেজ পাঠান:
          </div>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <a 
              href="${waReminder1}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-primary text-xs py-2 px-4 shadow-xs"
            >
              <span>WhatsApp 1: 01581703822</span>
            </a>
            <a 
              href="${waReminder2}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-secondary text-xs py-2 px-4 bg-white dark:bg-slate-800"
            >
              <span>WhatsApp 2: 01818273838</span>
            </a>
          </div>
        </div>

        <!-- Navigation Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button 
            class="btn-primary text-xs py-2.5 px-6"
            onclick="window.print()"
          >
            🖨️ ভাউচার প্রিন্ট / ডাউনলোড করুন
          </button>
          <a href="/track?orderId=${orderId}" class="btn-secondary text-xs py-2.5 px-5">
            🚚 পার্সেল ট্র্যাক করুন
          </a>
          <a href="/products" class="btn-secondary text-xs py-2.5 px-5">
            🛍️ আরও শপিং করুন
          </a>
        </div>

      </div>

      <!-- Official Digital Voucher -->
      <div class="space-y-3">
        <div class="text-center print:hidden">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">অফিশিয়াল ডিজিটাল ইনভয়েস ভাউচার</span>
        </div>
        ${renderVoucher(order)}
      </div>

    </div>
  `;
}
