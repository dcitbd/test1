/**
 * DREAM CART BD — EXTRAORDINARY NOTIFICATION & TOAST MANAGER
 * Rich message banners, action buttons, progress bars, sound cues.
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById("toast-container")) {
      const el = document.createElement("div");
      el.id = "toast-container";
      document.body.appendChild(el);
      this.container = el;
    } else {
      this.container = document.getElementById("toast-container");
    }
  }

  show({ type = "success", title = "", message = "", duration = 4000, actionText = null, onAction = null }) {
    this.init();
    const item = document.createElement("div");
    item.className = `toast-item toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg class="w-6 h-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === "warning") {
      iconSvg = `<svg class="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    } else {
      iconSvg = `<svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    item.innerHTML = `
      <div class="flex items-start gap-3 w-full">
        ${iconSvg}
        <div class="flex-1">
          ${title ? `<div class="font-bold text-slate-900 text-sm mb-0.5">${title}</div>` : ""}
          <div class="text-slate-600 text-xs leading-relaxed">${message}</div>
          ${actionText ? `<button class="mt-2 text-xs font-semibold text-emerald-700 underline hover:text-emerald-800 toast-action-btn">${actionText}</button>` : ""}
        </div>
        <button class="text-slate-400 hover:text-slate-600 toast-close-btn p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    `;

    const closeBtn = item.querySelector(".toast-close-btn");
    closeBtn.addEventListener("click", () => this.dismiss(item));

    if (actionText && onAction) {
      const actBtn = item.querySelector(".toast-action-btn");
      actBtn.addEventListener("click", () => {
        onAction();
        this.dismiss(item);
      });
    }

    this.container.appendChild(item);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(item);
      }, duration);
    }
  }

  dismiss(item) {
    if (!item) return;
    item.classList.add("toast-hide");
    setTimeout(() => {
      if (item.parentNode) {
        item.parentNode.removeChild(item);
      }
    }, 250);
  }
}

export const toast = new ToastManager();
