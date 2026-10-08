/**
 * DREAM CART BD — FORMATTING & HELPERS
 */

export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return "৳" + num.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatDate(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return isoStr;
  }
}

export function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = String(phone).replace(/[^0-9]/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("01")) {
    return cleaned.slice(0, 3) + " " + cleaned.slice(3, 7) + " " + cleaned.slice(7);
  }
  return phone;
}
