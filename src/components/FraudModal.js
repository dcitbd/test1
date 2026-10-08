/**
 * DREAM CART BD — FRAUD DETECTION & COURIER PERFORMANCE MODAL
 */

import { apiClient } from '../api/client.js';
import { toast } from './Toast.js';

export function renderFraudModal() {
  return `
    <div id="fraud-modal-backdrop" class="modal-backdrop">
      <div class="modal-card p-6">
        
        <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              🛡️
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-base">Multi-Courier Fraud & Delivery Risk Analyzer</h3>
              <p class="text-xs text-slate-500">Live Steadfast, Pathao & RedX delivery success intelligence</p>
            </div>
          </div>
          <button id="btn-close-fraud-modal" class="text-slate-400 hover:text-slate-600 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Phone Input -->
        <div class="mb-4">
          <label class="form-label text-xs">Customer Phone Number</label>
          <div class="flex gap-2">
            <div class="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-600">
              🇧🇩 +88
            </div>
            <input 
              type="tel" 
              id="fraud-phone-input" 
              placeholder="017XXXXXXXX" 
              value="01581703822"
              class="form-control text-sm py-2 flex-1"
            />
            <button id="btn-run-fraud-check" class="btn-primary text-xs py-2 px-4 whitespace-nowrap">
              Run Check
            </button>
          </div>
        </div>

        <!-- Result Card Container -->
        <div id="fraud-results-container" class="space-y-4">
          <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Overall Success Rate</span>
              <span class="text-lg font-black text-emerald-700">93.1%</span>
            </div>
            <div class="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
              <div class="bg-emerald-600 h-full rounded-full" style="width: 93.1%;"></div>
            </div>
            <div class="mt-2 text-xs font-medium text-emerald-900 flex items-center gap-1.5">
              <span>✅ Status: <strong>Low Risk Buyer</strong></span>
              <span>— Safe for Cash on Delivery</span>
            </div>
          </div>

          <!-- Courier Breakdown Table -->
          <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th class="p-2.5">Courier Hub</th>
                  <th class="p-2.5">Total Parcels</th>
                  <th class="p-2.5">Delivered</th>
                  <th class="p-2.5">Return (RTO)</th>
                  <th class="p-2.5">Rate</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td class="p-2.5 font-bold">Steadfast Courier</td>
                  <td class="p-2.5">16</td>
                  <td class="p-2.5 text-emerald-600 font-semibold">15</td>
                  <td class="p-2.5 text-rose-500 font-semibold">1</td>
                  <td class="p-2.5 font-bold">93.8%</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold">Pathao Courier</td>
                  <td class="p-2.5">9</td>
                  <td class="p-2.5 text-emerald-600 font-semibold">8</td>
                  <td class="p-2.5 text-rose-500 font-semibold">1</td>
                  <td class="p-2.5 font-bold">88.9%</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold">RedX Delivery</td>
                  <td class="p-2.5">4</td>
                  <td class="p-2.5 text-emerald-600 font-semibold">4</td>
                  <td class="p-2.5 text-rose-500 font-semibold">0</td>
                  <td class="p-2.5 font-bold">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  `;
}
