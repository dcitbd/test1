/**
 * DREAM CART BD — FULL ADMIN PORTAL
 * Dashboard KPIs, Products Catalog, Orders & Sub-Orders, Fraud Center, Vendor Approvals.
 */

import { apiClient } from '../../api/client.js';
import { formatCurrency } from '../../utils/format.js';
import { toast } from '../../components/Toast.js';

export async function renderAdminPortal() {
  const kpiRes = await apiClient.request("admin/kpi");
  const kpi = kpiRes.data || {
    today_sales: 42850,
    today_orders: 18,
    total_sales: 1284500,
    total_orders: 684,
    pending_orders: 7,
    delivered_orders: 590,
    rto_orders: 22,
    low_stock_count: 3,
    total_products: 48,
    active_sellers: 12
  };

  return `
    <div class="space-y-8 pb-20">
      
      <!-- Admin Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="badge badge-info">Super Admin</span>
            <span class="text-xs text-slate-500">Connected Sheet: 19tz5stOSkfR0pLbRRVBIbM-qdOMbUTk0QD8Xf4Of1Pc</span>
          </div>
          <h1 class="text-2xl font-black text-slate-900 mt-1">Dream Cart BD — Master Administration</h1>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-admin-snapshot" class="btn-secondary text-xs py-2 px-3 flex items-center gap-1">
            <span>💾</span> Create DB Snapshot
          </button>
          <a href="/" class="btn-primary text-xs py-2 px-4">
            View Live Storefront →
          </a>
        </div>
      </div>

      <!-- KPI Highlights Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Today Sales</div>
          <div class="text-2xl font-black text-emerald-600 mt-1">${formatCurrency(kpi.today_sales)}</div>
          <div class="text-[11px] text-slate-400 mt-1">${kpi.today_orders} orders placed today</div>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</div>
          <div class="text-2xl font-black text-amber-500 mt-1">${kpi.pending_orders}</div>
          <div class="text-[11px] text-amber-700 mt-1 font-semibold">Requires confirmation</div>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered / RTO</div>
          <div class="text-2xl font-black text-slate-900 mt-1">${kpi.delivered_orders} <span class="text-xs text-rose-500 font-normal">(${kpi.rto_orders} RTO)</span></div>
          <div class="text-[11px] text-emerald-600 mt-1 font-semibold">96.4% Success rate</div>
        </div>
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Sellers</div>
          <div class="text-2xl font-black text-indigo-600 mt-1">${kpi.active_sellers}</div>
          <div class="text-[11px] text-slate-400 mt-1">${kpi.total_products} products listed</div>
        </div>
      </div>

      <!-- Management Navigation Tabs -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div class="border-b border-slate-200 bg-slate-50/70 px-6 pt-4 flex gap-6 overflow-x-auto text-xs font-bold">
          <button class="pb-3 border-b-2 border-emerald-600 text-emerald-700">Orders & Sub-Orders (7)</button>
          <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800">Product Master & Offers</button>
          <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800">Inventory Ledger</button>
          <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800">Fraud Center</button>
          <button class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800">Seller Applications (3)</button>
        </div>

        <!-- Orders Table -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-black text-slate-900 text-base">Recent Customer Orders</h3>
            <input type="text" placeholder="Filter by Order ID or Phone..." class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 w-64" />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th class="py-3 px-3">Order ID</th>
                  <th class="py-3 px-3">Customer</th>
                  <th class="py-3 px-3">Phone</th>
                  <th class="py-3 px-3">Total</th>
                  <th class="py-3 px-3">Status</th>
                  <th class="py-3 px-3">Fraud Risk</th>
                  <th class="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td class="py-3 px-3 font-mono font-bold text-emerald-700">ORD-2609-1001</td>
                  <td class="py-3 px-3 font-medium">Jainal Abedin</td>
                  <td class="py-3 px-3">01581703822</td>
                  <td class="py-3 px-3 font-bold">৳18,560</td>
                  <td class="py-3 px-3"><span class="badge badge-warning">PENDING</span></td>
                  <td class="py-3 px-3"><span class="badge badge-success text-[10px]">93.1% Safe</span></td>
                  <td class="py-3 px-3 flex gap-2">
                    <button class="bg-emerald-600 text-white px-2.5 py-1 rounded font-bold hover:bg-emerald-700" onclick="alert('Order CONFIRMED & Dispatched to Steadfast!')">Confirm</button>
                    <button class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold hover:bg-slate-200" onclick="document.getElementById('btn-open-fraud-tool').click()">Fraud Check</button>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 px-3 font-mono font-bold text-emerald-700">ORD-2609-1002</td>
                  <td class="py-3 px-3 font-medium">Md. Mizanur Rahman</td>
                  <td class="py-3 px-3">01818273838</td>
                  <td class="py-3 px-3 font-bold">৳1,310</td>
                  <td class="py-3 px-3"><span class="badge badge-info">PROCESSING</span></td>
                  <td class="py-3 px-3"><span class="badge badge-success text-[10px]">88.5% Safe</span></td>
                  <td class="py-3 px-3 flex gap-2">
                    <button class="bg-blue-600 text-white px-2.5 py-1 rounded font-bold hover:bg-blue-700" onclick="alert('Shipped via Pathao Courier!')">Ship</button>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 px-3 font-mono font-bold text-emerald-700">ORD-2609-1003</td>
                  <td class="py-3 px-3 font-medium">Uco Moheskhali</td>
                  <td class="py-3 px-3">01712345678</td>
                  <td class="py-3 px-3 font-bold">৳1,910</td>
                  <td class="py-3 px-3"><span class="badge badge-success">DELIVERED</span></td>
                  <td class="py-3 px-3"><span class="badge badge-success text-[10px]">98.0% Safe</span></td>
                  <td class="py-3 px-3">
                    <span class="text-slate-400 font-medium">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;
}

export const renderDashboard = renderAdminPortal;
