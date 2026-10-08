export function throttle(fn, l=300){ let th; return (...a)=>{ if(!th){ fn(...a); th=true; setTimeout(()=>th=false, l); } }; }
