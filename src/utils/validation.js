export function isValidBDPhone(p){ return /^(?:\+?88)?01[3-9]\d{8}$/.test(String(p).replace(/\s+/g, '')); }
