/**
 * DREAM CART BD — OFFICIAL INVOICE / VOUCHER COMPONENT
 */

import { formatCurrency } from '../utils/format.js';

export function renderVoucher(order) {
  if (!order) return "";

  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
    {
      name: order.products || "পণ্য সমাহার",
      sku: order.color ? `${order.color} / ${order.size || 'Std'}` : "DCBD-ITEM",
      quantity: order.quantity || 1,
      price: order.total_amount || 0
    }
  ];

  const subtotal = items.reduce((s, it) => s + (Number(it.price) * Number(it.quantity)), 0);
  const totalAmount = Number(order.total_amount || subtotal);
  const deliveryFee = totalAmount >= 2000 ? 0 : 90;
  const orderId = order.order_id || order.orderId || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = order.date || new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

  return `
    <div class="voucher-wrapper bg-white text-slate-900 rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 max-w-2xl mx-auto relative overflow-hidden font-sans my-6 print:m-0 print:p-6 print:border-none print:shadow-none">
      
      <!-- Watermark Logo -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] select-none z-0">
        <img 
          src="https://pictures-bangladesh.jijistatic.com/2033199_MjAwLTIwMC03Nzk0Y2Y2Yzkx.jpg" 
          alt="Watermark" 
          class="w-96 h-96 object-contain"
        />
      </div>

      <div class="relative z-10">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-emerald-600 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1.5 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src="https://pictures-bangladesh.jijistatic.com/2033199_MjAwLTIwMC03Nzk0Y2Y2Yzkx.jpg" 
                alt="Dream Cart BD Logo" 
                class="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">Dream Cart <span class="text-emerald-600">BD</span></h2>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Smart Digital Commerce Platform</p>
              <p class="text-[11px] text-slate-600 mt-0.5">চৌধুরী প্লাজা, পদুয়ার বাজার বিশ্বরোড, সদর দক্ষিণ, কুমিল্লা।</p>
              <p class="text-[11px] text-slate-600">হটলাইন: 01581703822, 01818273838</p>
            </div>
          </div>

          <div class="sm:text-right">
            <div class="inline-block bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              Official Invoice
            </div>
            <div class="text-xs font-bold text-slate-700">Order ID: <span class="font-mono text-emerald-700 text-sm">${orderId}</span></div>
            <div class="text-[11px] text-slate-500">তারিখ: ${dateStr}</div>
          </div>
        </div>

        <!-- Customer & Delivery Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-100 text-xs">
          <div class="space-y-1">
            <h4 class="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">গ্রাহকের বিবরণ:</h4>
            <div class="font-bold text-slate-800 text-sm">${order.customer_name || "সম্মানিত গ্রাহক"}</div>
            <div class="text-slate-600">📞 মোবাইল: <strong>${order.phone || "01700000000"}</strong></div>
            <div class="text-slate-600">📍 ঠিকানা: ${order.address || "বাংলাদেশ"}</div>
          </div>

          <div class="sm:text-right space-y-1">
            <h4 class="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">পেমেন্ট বিবরণ:</h4>
            <div class="text-slate-700">মেথড: <strong class="text-slate-900">${order.payment_method || "Cash On Delivery (COD)"}</strong></div>
            <div class="text-slate-700">স্ট্যাটাস: <span class="font-bold px-2 py-0.5 rounded text-[10px] ${order.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${order.payment_status || "COD"}</span></div>
            <div class="text-slate-700">অর্ডার স্ট্যাটাস: <strong class="text-emerald-700">${order.order_status || "Order Confirmed"}</strong></div>
          </div>
        </div>

        <!-- Itemized Table -->
        <div class="py-5 border-b border-slate-100">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th class="py-2">নং</th>
                <th class="py-2">পণ্য</th>
                <th class="py-2 text-center">পরিমাণ</th>
                <th class="py-2 text-right">দর</th>
                <th class="py-2 text-right">মোট</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${items.map((it, idx) => `
                <tr>
                  <td class="py-2 text-slate-400">${idx + 1}</td>
                  <td class="py-2 font-medium text-slate-800">${it.name || "পণ্য"}</td>
                  <td class="py-2 text-center font-bold">${it.quantity || 1}</td>
                  <td class="py-2 text-right">${formatCurrency(it.price)}</td>
                  <td class="py-2 text-right font-bold">${formatCurrency(Number(it.price) * Number(it.quantity || 1))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Total Calculation -->
        <div class="py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <!-- Barcode -->
          <div class="flex flex-col items-start gap-1">
            <div class="font-mono text-[9px] tracking-widest text-slate-400 uppercase">BARCODE TRACKER</div>
            <div class="h-9 px-2 py-1 bg-white border border-slate-300 rounded flex items-center gap-[2px]">
              ${Array.from({ length: 28 }).map((_, i) => `
                <span style="display:inline-block; height:100%; width:${(i % 3 === 0) ? '3px' : '1.5px'}; background:#0f172a;"></span>
              `).join("")}
            </div>
            <div class="font-mono text-[10px] text-slate-600 font-bold">${orderId}</div>
          </div>

          <!-- Total Summary -->
          <div class="w-full sm:w-60 space-y-1 text-xs text-slate-700">
            <div class="flex justify-between">
              <span>সাবটোটাল:</span>
              <span class="font-bold">${formatCurrency(subtotal)}</span>
            </div>
            <div class="flex justify-between">
              <span>ডেলিভারি চার্জ:</span>
              <span class="font-bold text-emerald-700">${deliveryFee === 0 ? 'ফ্রি (৳০)' : formatCurrency(deliveryFee)}</span>
            </div>
            <div class="flex justify-between border-t border-slate-200 pt-1 text-sm font-black text-slate-900">
              <span>সর্বমোট:</span>
              <span class="text-emerald-700">${formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-4 text-center space-y-1">
          <p class="text-xs font-semibold text-emerald-700">
            ✨ ড্রিম কার্ট বিডি-র সাথে কেনাকাটা করার জন্য ধন্যবাদ!
          </p>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3 print:hidden">
        <button class="btn-primary py-2 px-5 text-xs font-bold" onclick="window.print()">
          🖨️ ভাউচার প্রিন্ট / ডাউনলোড
        </button>
      </div>

    </div>
  `;
}
