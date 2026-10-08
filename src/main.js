/**
 * DREAM CART BD — MASTER FRONTEND BOOTSTRAPPER (main.js)
 * Implements:
 * - HTML5 History API Path Router (ZERO hash '#', domain/products clean URLs)
 * - Live predictive search dropdown with interactive preview cards
 * - Floating fixed actions dock (Cart, Call sub-buttons, WhatsApp sub-buttons, Live Chat)
 * - Dark mode toggle & theme persistence
 * - Reactive stores wiring (Cart, Favourites, Auth)
 * - Incomplete order tracking
 */

import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderMobileNav } from './components/MobileNav.js';
import { renderCartDrawer } from './components/CartDrawer.js';
import { renderFraudModal } from './components/FraudModal.js';
import { renderFloatingActions } from './components/FloatingActions.js';
import { toast } from './components/Toast.js';
import { cartStore } from './store/cartStore.js';
import { favouriteStore } from './store/favouriteStore.js';
import { authStore } from './store/authStore.js';
import { router } from './router.js';
import { apiClient } from './api/client.js';
import { formatCurrency } from './utils/format.js';

function initApp() {
  try {
    const root = document.getElementById('app-root');
    if (!root) {
      console.error("Could not find #app-root element");
      return;
    }

    // Apply saved theme (Dark / Light)
    const savedTheme = localStorage.getItem("dcbd_theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    root.innerHTML = `
      <div id="header-mount"></div>
      <main id="app-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20"></main>
      <div id="footer-mount"></div>
      <div id="floatingactions-mount"></div>
      <div id="mobilenav-mount"></div>
      <div id="cartdrawer-mount"></div>
      <div id="fraudmodal-mount"></div>
    `;

    // Mount persistent components
    updateHeader();
    const footerMount = document.getElementById('footer-mount');
    if (footerMount) footerMount.innerHTML = renderFooter();
    updateMobileNav();
    updateCartDrawer();
    updateFloatingActions();
    const fraudMount = document.getElementById('fraudmodal-mount');
    if (fraudMount) fraudMount.innerHTML = renderFraudModal();

    // Subscribe to store updates
    cartStore.subscribe(() => {
      updateHeader();
      updateMobileNav();
      updateCartDrawer();
      updateFloatingActions();
      updateCheckoutSummary();
    });

    favouriteStore.subscribe(() => {
      updateHeader();
      updateMobileNav();
    });

    authStore.subscribe(() => {
      updateHeader();
      router.resolve();
    });

    // Attach global click & event delegates
    attachEventListeners();
    attachLiveSearchHandlers();

    // Handle History navigation
    window.addEventListener('popstate', () => router.resolve());
    
    // Resolve initial URL
    router.resolve();

    // Log viewer activity for analytics (Viewers Sheet)
    apiClient.request("viewers/log", {
      time: new Date().toISOString(),
      device: window.innerWidth < 768 ? "Mobile" : "Desktop/Laptop",
      activity: "Site Visit"
    });

  } catch (err) {
    console.error("Application initialization error:", err);
  }
}

function updateHeader() {
  const mount = document.getElementById('header-mount');
  if (mount) mount.innerHTML = renderHeader();
}

function updateMobileNav() {
  const mount = document.getElementById('mobilenav-mount');
  if (mount) mount.innerHTML = renderMobileNav();
}

function updateCartDrawer() {
  const mount = document.getElementById('cartdrawer-mount');
  if (mount) mount.innerHTML = renderCartDrawer();
}

function updateFloatingActions() {
  const mount = document.getElementById('floatingactions-mount');
  if (mount) mount.innerHTML = renderFloatingActions();
}

function openCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const panel = document.getElementById('cart-drawer-panel');
  if (overlay) overlay.classList.remove('hidden');
  if (panel) panel.classList.remove('translate-x-full');
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const panel = document.getElementById('cart-drawer-panel');
  if (overlay) overlay.classList.add('hidden');
  if (panel) panel.classList.add('translate-x-full');
}

function updateCheckoutSummary() {
  const chargeEl = document.getElementById('summary-delivery-charge');
  const grandTotalEl = document.getElementById('summary-grand-total');
  const onlineRowEl = document.getElementById('summary-online-discount-row');
  const onlineAmtEl = document.getElementById('summary-online-discount-amount');

  if (chargeEl) {
    const fee = cartStore.getDeliveryCharge();
    if (fee === 0) {
      chargeEl.innerHTML = '<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">ফ্রি (৳০)</span>';
    } else {
      chargeEl.textContent = formatCurrency(fee);
    }
  }

  const onlineDiscount = cartStore.getOnlinePaymentDiscount();
  if (onlineRowEl) {
    if (onlineDiscount > 0) {
      onlineRowEl.classList.remove('hidden');
      if (onlineAmtEl) onlineAmtEl.textContent = `-${formatCurrency(onlineDiscount)}`;
    } else {
      onlineRowEl.classList.add('hidden');
    }
  }

  if (grandTotalEl) {
    grandTotalEl.textContent = formatCurrency(cartStore.getGrandTotal());
  }
}

function attachEventListeners() {
  // 1. Intercept all internal anchor navigation for clean path URLs (NO #)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Check if external, protocol, target blank, or anchor jump
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) {
      return;
    }

    // If anchor on same page, let browser handle
    if (href.startsWith('#') && !href.startsWith('#/')) {
      return;
    }

    // Internal navigation
    e.preventDefault();
    router.navigate(href);
  });

  // 2. Global delegate for interactive triggers
  document.addEventListener('click', async (e) => {
    
    // Toggle Dark Mode
    if (e.target.closest('#btn-toggle-darkmode')) {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('dcbd_theme', isDark ? 'dark' : 'light');
      updateHeader();
      return;
    }

    // Mobile Hamburger Menu Toggle
    if (e.target.closest('#btn-mobile-menu-toggle')) {
      const menu = document.getElementById('mobile-dropdown-menu');
      if (menu) menu.classList.toggle('hidden');
      return;
    }

    // Auth dropdown menu
    if (e.target.closest('#btn-user-menu')) {
      const panel = document.getElementById('auth-dropdown-panel');
      if (panel) panel.classList.toggle('hidden');
      return;
    }

    // Logout
    if (e.target.closest('#btn-logout')) {
      authStore.logout();
      toast.show({ type: "info", title: "লগআউট", message: "আপনি সফলভাবে লগআউট হয়েছেন।" });
      router.navigate('/');
      return;
    }

    // Open/Close Cart Drawer
    if (e.target.closest('#btn-open-cart') || e.target.closest('#mobile-cart-btn') || e.target.closest('#btn-floating-cart')) {
      openCartDrawer();
      return;
    }
    if (e.target.closest('#btn-close-cart') || e.target.id === 'cart-drawer-overlay') {
      closeCartDrawer();
      return;
    }

    // Floating Call Sub-menu Toggle
    if (e.target.closest('#btn-floating-call')) {
      const menu = document.getElementById('call-sub-menu');
      if (menu) menu.classList.toggle('hidden');
      return;
    }

    // Floating WhatsApp Sub-menu Toggle
    if (e.target.closest('#btn-floating-wa')) {
      const menu = document.getElementById('wa-sub-menu');
      if (menu) menu.classList.toggle('hidden');
      return;
    }

    // Close floating submenus when clicked outside
    if (!e.target.closest('#call-menu-group') && !e.target.closest('#wa-menu-group')) {
      const callMenu = document.getElementById('call-sub-menu');
      const waMenu = document.getElementById('wa-sub-menu');
      if (callMenu) callMenu.classList.add('hidden');
      if (waMenu) waMenu.classList.add('hidden');
    }

    // Toggle Favourite / Wishlist
    const favBtn = e.target.closest('.btn-toggle-favourite');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = favBtn.getAttribute('data-product-id');
      const res = await apiClient.request("products/details", { id: pId });
      if (res.data) {
        const added = favouriteStore.toggle(res.data);
        toast.show({
          type: added ? "success" : "info",
          title: added ? "পছন্দের তালিকায় যুক্ত হয়েছে" : "পছন্দের তালিকা থেকে সরানো হয়েছে",
          message: res.data.name,
          duration: 3000
        });
      }
      return;
    }

    // Quick Add to Cart Button
    const quickAddBtn = e.target.closest('.btn-quick-add');
    if (quickAddBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = quickAddBtn.getAttribute('data-product-id');
      const res = await apiClient.request("products/details", { id: pId });
      if (res.data) {
        cartStore.addItem(res.data, 1);
        toast.show({
          type: "success",
          title: "কার্টে যুক্ত হয়েছে",
          message: `${res.data.name} কার্টে যোগ করা হয়েছে।`,
          duration: 3500
        });
        openCartDrawer();
      }
      return;
    }

    // Detail Add to Cart
    if (e.target.closest('#btn-detail-add-cart')) {
      const btn = e.target.closest('#btn-detail-add-cart');
      const pId = btn.getAttribute('data-product-id');
      const qtyInp = document.getElementById('product-qty-input');
      const qty = parseInt(qtyInp ? qtyInp.value : '1', 10);
      const res = await apiClient.request("products/details", { id: pId });
      if (res.data) {
        cartStore.addItem(res.data, qty);
        toast.show({
          type: "success",
          title: "কার্টে যুক্ত হয়েছে",
          message: `${res.data.name} (${qty} টি) কার্টে যোগ করা হয়েছে।`,
          duration: 3500
        });
        openCartDrawer();
      }
      return;
    }

    // Order Now Button (Direct checkout)
    const orderNowBtn = e.target.closest('.btn-order-now') || e.target.closest('#btn-detail-order-now');
    if (orderNowBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = orderNowBtn.getAttribute('data-product-id');
      const qtyInp = document.getElementById('product-qty-input');
      const qty = parseInt(qtyInp ? qtyInp.value : '1', 10);
      const res = await apiClient.request("products/details", { id: pId });
      if (res.data) {
        cartStore.addItem(res.data, qty);
        router.navigate('/checkout');
      }
      return;
    }

    // Pre-Order Button
    const preOrderBtn = e.target.closest('.btn-pre-order') || e.target.closest('#btn-detail-preorder');
    if (preOrderBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = preOrderBtn.getAttribute('data-product-id');
      const res = await apiClient.request("products/details", { id: pId });
      if (res.data) {
        cartStore.addItem(res.data, 1);
        toast.show({
          type: "info",
          title: "প্রি-অর্ডার বুকিং",
          message: `${res.data.name} প্রি-অর্ডার কার্টে যুক্ত হয়েছে। চেকআউটে কনফার্ম করুন।`,
          duration: 4000
        });
        router.navigate('/checkout');
      }
      return;
    }

    // Cart Quantity Plus / Minus / Remove
    const plusBtn = e.target.closest('.btn-cart-plus');
    if (plusBtn) {
      const pId = plusBtn.getAttribute('data-product-id');
      const color = plusBtn.getAttribute('data-color') || '';
      const size = plusBtn.getAttribute('data-size') || '';
      const item = cartStore.items.find(i => i.product_id === pId && (i.color || '') === color && (i.size || '') === size);
      if (item) {
        cartStore.updateQuantity(pId, item.quantity + 1, { color, size });
      }
      return;
    }

    const minusBtn = e.target.closest('.btn-cart-minus');
    if (minusBtn) {
      const pId = minusBtn.getAttribute('data-product-id');
      const color = minusBtn.getAttribute('data-color') || '';
      const size = minusBtn.getAttribute('data-size') || '';
      const item = cartStore.items.find(i => i.product_id === pId && (i.color || '') === color && (i.size || '') === size);
      if (item) {
        cartStore.updateQuantity(pId, item.quantity - 1, { color, size });
      }
      return;
    }

    const removeBtn = e.target.closest('.btn-cart-remove');
    if (removeBtn) {
      const pId = removeBtn.getAttribute('data-product-id');
      const color = removeBtn.getAttribute('data-color') || '';
      const size = removeBtn.getAttribute('data-size') || '';
      cartStore.removeItem(pId, { color, size });
      return;
    }

    // Clear Cart Button
    if (e.target.closest('#btn-clear-cart')) {
      if (confirm('আপনি কি সম্পূর্ণ কার্ট খালি করতে চান?')) {
        cartStore.clear();
      }
      return;
    }

    // Product Card / Image Click -> Navigate to details
    const cardClick = e.target.closest('.card-img-click');
    if (cardClick && !e.target.closest('.btn-toggle-favourite') && !e.target.closest('button')) {
      const slug = cardClick.getAttribute('data-slug');
      if (slug) {
        router.navigate('/product/' + slug);
      }
      return;
    }

  });

  // Handle Delivery Zone & Payment Changes on Checkout
  document.addEventListener('change', (e) => {
    if (e.target.name === 'delivery_zone') {
      cartStore.setDeliveryZone(e.target.value);
    }
    if (e.target.name === 'payment_method') {
      cartStore.setPaymentMethod(e.target.value);
      const box = document.getElementById('payment-details-box');
      if (box) {
        if (cartStore.isOnlinePayment()) {
          box.classList.remove('hidden');
        } else {
          box.classList.add('hidden');
        }
      }
    }
    if (e.target.id === 'cart-zone-select') {
      cartStore.setDeliveryZone(e.target.value);
    }
  });

  // Auto Incomplete Order Tracking on typing phone & address
  let incTimeout = null;
  document.addEventListener('input', (e) => {
    if (e.target.id === 'checkout-phone' || e.target.id === 'checkout-name' || e.target.id === 'checkout-address') {
      clearTimeout(incTimeout);
      incTimeout = setTimeout(() => {
        const phone = document.getElementById('checkout-phone')?.value;
        const name = document.getElementById('checkout-name')?.value;
        const addr = document.getElementById('checkout-address')?.value;
        if (phone && phone.length >= 7) {
          apiClient.request("incomplete_orders/create", {
            phone,
            customer_name: name,
            address: addr,
            total_amount: cartStore.getGrandTotal(),
            products: cartStore.items.map(i => `${i.name} (${i.quantity})`).join(", ")
          });
        }
      }, 1500);
    }
  });

  // Checkout Form Submission
  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'checkout-form') {
      e.preventDefault();
      const name = document.getElementById('checkout-name')?.value.trim();
      const phone = document.getElementById('checkout-phone')?.value.trim();
      const address = document.getElementById('checkout-address')?.value.trim();
      const trxId = document.getElementById('checkout-trxid')?.value.trim() || 'N/A';

      if (!name || !phone || !address) {
        alert('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা সঠিকভাবে লিখুন।');
        return;
      }

      if (cartStore.isOnlinePayment() && trxId === 'N/A') {
        alert('অনলাইন পেমেন্ট নির্বাচিত হয়েছে। অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
        return;
      }

      const orderPayload = {
        customer_name: name,
        phone: phone,
        address: address,
        account_type: authStore.getAccountType(),
        items: cartStore.items,
        total_amount: cartStore.getGrandTotal(),
        payment_method: cartStore.paymentMethod,
        transaction_id: trxId,
        payment_status: cartStore.paymentMethod === 'COD' ? 'COD' : 'Paid',
        order_status: 'Order Placed',
        reseller_commission: authStore.isReseller() ? Math.round(cartStore.getSubtotal() * 0.1) : 0
      };

      const btn = document.getElementById('btn-confirm-order');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "অর্ডার প্রসেস হচ্ছে...";
      }

      const res = await apiClient.request("orders/create", orderPayload);
      if (res && res.data) {
        const orderId = res.data.order_id || res.data.orderId;
        cartStore.clear();
        toast.show({
          type: "success",
          title: "অর্ডার কনফার্মড!",
          message: `আপনার অর্ডার #${orderId} সফলভাবে গৃহীত হয়েছে।`,
          duration: 5000
        });
        router.navigate('/order-success?orderId=' + orderId);
      } else {
        alert('অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
        if (btn) {
          btn.disabled = false;
          btn.textContent = "অর্ডার নিশ্চিত করুন";
        }
      }
    }

    // Landing Page Order Form Submission
    if (e.target.id === 'landing-order-form') {
      e.preventDefault();
      const prodSelect = document.getElementById('lp-product-select');
      const selectedOption = prodSelect.options[prodSelect.selectedIndex];
      const prodName = selectedOption.getAttribute('data-name');
      const prodPrice = Number(selectedOption.getAttribute('data-price'));
      const pId = prodSelect.value;
      const qty = parseInt(document.getElementById('lp-quantity').value, 10);
      const color = document.getElementById('lp-color')?.value || "";
      const size = document.getElementById('lp-size')?.value || "";
      const name = document.getElementById('lp-name').value.trim();
      const phone = document.getElementById('lp-phone').value.trim();
      const address = document.getElementById('lp-address').value.trim();
      const payment = document.querySelector('input[name="lp_payment"]:checked')?.value || "Cash On Delivery (COD)";

      const orderPayload = {
        customer_name: name,
        phone: phone,
        address: address,
        account_type: "Customer",
        items: [{
          product_id: pId,
          name: prodName,
          quantity: qty,
          price: prodPrice,
          color,
          size
        }],
        total_amount: (prodPrice * qty) + 90,
        payment_method: payment,
        transaction_id: "N/A",
        payment_status: payment === 'Cash On Delivery (COD)' ? 'COD' : 'Paid',
        order_status: 'Order Placed'
      };

      const res = await apiClient.request("orders/create", orderPayload);
      if (res && res.data) {
        const orderId = res.data.order_id || res.data.orderId;
        toast.show({
          type: "success",
          title: "ক্যাম্পেইন অর্ডার সফল!",
          message: `আপনার অর্ডার #${orderId} কনফার্ম করা হয়েছে।`,
          duration: 5000
        });
        router.navigate('/order-success?orderId=' + orderId);
      }
    }
  });
}

/**
 * Live predictive search dropdown with preview cards
 */
function attachLiveSearchHandlers() {
  const attachInput = (inputEl, popupEl) => {
    if (!inputEl || !popupEl) return;

    let debounceTimer = null;

    inputEl.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim().toLowerCase();

      if (!query || query.length < 2) {
        popupEl.innerHTML = '';
        popupEl.classList.add('hidden');
        return;
      }

      debounceTimer = setTimeout(() => {
        const matches = apiClient.products.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
        ).slice(0, 5); // top 5 preview cards

        if (matches.length === 0) {
          popupEl.innerHTML = `
            <div class="p-4 text-center text-xs text-slate-500">
              "${query}" এর কোনো পণ্য মেলেনি। <a href="/products" class="text-emerald-600 font-bold hover:underline">সকল পণ্য দেখুন</a>
            </div>
          `;
          popupEl.classList.remove('hidden');
        } else {
          popupEl.innerHTML = `
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                পণ্য প্রিভিউ (ক্লিক করে বিস্তারিত দেখুন):
              </div>
              ${matches.map(p => `
                <div class="search-preview-item" onclick="router.navigate('/product/${p.slug}'); document.getElementById('search-preview-popup').classList.add('hidden');">
                  <img src="${p.thumbnail || (p.images && p.images[0])}" alt="${p.name}" />
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${p.name}</div>
                    <div class="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span class="font-mono">${p.sku}</span>
                      <span>•</span>
                      <span class="text-emerald-600 font-black">${formatCurrency(p.selling_price)}</span>
                      <span>•</span>
                      <span>${p.category}</span>
                    </div>
                  </div>
                </div>
              `).join("")}
              <div class="p-2.5 text-center bg-slate-50 dark:bg-slate-800">
                <a href="/products?search=${encodeURIComponent(query)}" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  সকল সার্চ রেজাল্ট দেখুন (${matches.length}) →
                </a>
              </div>
            </div>
          `;
          popupEl.classList.remove('hidden');
        }
      }, 250);
    });

    // Close preview when clicked outside
    document.addEventListener('click', (e) => {
      if (!inputEl.contains(e.target) && !popupEl.contains(e.target)) {
        popupEl.classList.add('hidden');
      }
    });

    // Enter press -> navigate to products search
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = inputEl.value.trim();
        if (q) {
          popupEl.classList.add('hidden');
          router.navigate('/products?search=' + encodeURIComponent(q));
        }
      }
    });
  };

  attachInput(document.getElementById('global-search-input'), document.getElementById('search-preview-popup'));
  attachInput(document.getElementById('mobile-search-input'), document.getElementById('mobile-search-preview-popup'));

  // Global search button click
  const btn = document.getElementById('global-search-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const q = document.getElementById('global-search-input')?.value.trim();
      if (q) router.navigate('/products?search=' + encodeURIComponent(q));
    });
  }
}

// Live Chat Window message sending utility
window.sendChatMessage = function(userMsg) {
  const container = document.getElementById('chat-messages-container');
  if (!container || !userMsg) return;

  // Append user message
  const userHtml = `
    <div class="flex items-start justify-end gap-2.5">
      <div class="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed max-w-[85%]">
        ${userMsg}
      </div>
      <div class="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
        👤
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', userHtml);
  container.scrollTop = container.scrollHeight;

  // Bot auto reply
  setTimeout(() => {
    let reply = "ধন্যবাদ আপনার বার্তার জন্য! আমাদের একজন কাস্টমার প্রতিনিধি শীঘ্রই উত্তর দিচ্ছেন। জরুরি অর্ডারে সরাসরি 01581703822 নম্বরে WhatsApp করতে পারেন।";
    if (userMsg.includes('ডেলিভারি চার্জ')) {
      reply = "আমাদের ডেলিভারি চার্জ: কুমিল্লা সদর ৳৭০, ঢাকা সিটি ৳৯০, এবং ঢাকার বাইরে সারা দেশে ৳১২০। এছাড়া ৳২,০০০ বা তার বেশি অর্ডারে ডেলিভারি সম্পূর্ণ ফ্রি!";
    } else if (userMsg.includes('ট্র্যাক')) {
      reply = "আপনার অর্ডার ট্র্যাক করতে আমাদের ট্র্যাকিং পেজে (/track) যান এবং আপনার ১১ ডিজিট মোবাইল নম্বর বা অর্ডার আইডি দিয়ে সার্চ করুন।";
    } else if (userMsg.includes('রিসেলার')) {
      reply = "ড্রিম কার্ট বিডি-তে বিনা পুঁজিতে রিসেলিং ব্যবসা শুরু করতে আমাদের রিসেলার পোর্টালে (/reseller/register) ফ্রি রেজিস্ট্রেশন করুন অথবা 01581703822 নম্বরে যোগাযোগ করুন।";
    }

    const botHtml = `
      <div class="flex items-start gap-2.5 max-w-[85%]">
        <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
          🤖
        </div>
        <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-slate-800 dark:text-slate-200 leading-relaxed">
          ${reply}
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', botHtml);
    container.scrollTop = container.scrollHeight;
  }, 600);
};

// Bootstrap application on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
