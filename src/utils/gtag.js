// GA4 measurement ID (also configured in public/index.html)
export const GA4_MEASUREMENT_ID = "G-RM1HWM3138";

/**
 * Fire a GA4 event via gtag. Works once index.html has loaded gtag.js,
 * or falls back to queuing on dataLayer like Google's snippet.
 */
export function gtagEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag("event", eventName, params);
}

/**
 * Runs fn once per browser tab/session for this pathname + search + scope key
 * (avoids duplicate funnel events under React Strict Mode remounts).
 */
export function ga4SessionOnce(scopeKey, fn) {
  if (typeof window === "undefined") return;
  try {
    const k = `ga4_${scopeKey}_${window.location.pathname}`;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
    fn();
  } catch {
    fn();
  }
}

/** Purchase must fire only once per successful order id */
export function ga4PurchaseOnce(orderId, fn) {
  if (typeof window === "undefined") return;
  try {
    const k = `ga4_purchase_${orderId}`;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
    fn();
  } catch {
    fn();
  }
}

/** Legacy Google Ads tag — loads AW conversion ID if needed elsewhere */
export const loadGoogleTag = () => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  const awId = "AW-11515103107";
  const src = `https://www.googletagmanager.com/gtag/js?id=${awId}`;
  if (!document.querySelector(`script[src="${src}"]`)) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }
  window.gtag("config", awId);
};
