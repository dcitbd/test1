/**
 * DREAM CART BD — PARTNER PORTAL (SELLER, RESELLER, WHOLESALER)
 */

import { apiClient } from '../../api/client.js';
import { formatCurrency } from '../../utils/format.js';
import { toast } from '../../components/Toast.js';

export function renderPartnerPortal() {
  return `
    <div class="space-y-8 pb-20">
      
      <div class="border-b border-slate-200 pb-4">
        <span class="badge badge-info">Multi-Vendor Ecosystem</span>
        <h1 class="text-2xl font-black text-slate-900 mt-1">Dream Cart BD Partner Hub</h1>
        <p class="text-xs text-slate-500 mt-0.5">Unified portal for Sellers, Resellers, and Wholesale Distributors</p>
      </div>

      <!-- Partner Sections Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Seller Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4">
              🏪
            </div>
            <h3 class="font-extrabold text-slate-900 text-lg">Marketplace Seller</h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              List your products on Dream Cart BD. Fulfill orders, track earnings, manage your store inventory, and receive weekly bank/bKash payouts.
            </p>
          </div>
          <button class="btn-primary mt-6 text-xs w-full py-2.5" onclick="alert('Seller Application Form submitted!')">
            Apply as Seller
          </button>
        </div>

        <!-- Reseller Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold mb-4">
              💼
            </div>
            <h3 class="font-extrabold text-slate-900 text-lg">Dropshipping Reseller</h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              Access the exclusive Reseller Catalog with pre-negotiated wholesale margins. Sell on your Facebook page or website while we deliver under your name.
            </p>
          </div>
          <button class="btn-secondary mt-6 text-xs w-full py-2.5 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" onclick="alert('Reseller Catalog Loaded!')">
            View Reseller Margins
          </button>
        </div>

        <!-- Wholesaler Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold mb-4">
              📦
            </div>
            <h3 class="font-extrabold text-slate-900 text-lg">Wholesale Bulk Buyer</h3>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              Master carton bulk orders with high minimum quantity discounts (MOQ). Dedicated credit statements, tax invoices, and priority logistics.
            </p>
          </div>
          <button class="btn-secondary mt-6 text-xs w-full py-2.5 bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100" onclick="alert('Wholesale Bulk Sheet Loaded!')">
            Wholesale Catalog & MOQ
          </button>
        </div>

      </div>

    </div>
  `;
}

export const renderSellerDashboard = renderPartnerPortal;
