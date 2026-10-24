/** Reads the cm_attr cookie written by public/cm-attribution.js. */

export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
  "landing_page_url",
  "first_visit_at",
];

export function readAttribution() {
  if (typeof window === "undefined") return null;
  if (window.CoastlineAttribution && typeof window.CoastlineAttribution.read === "function") {
    return window.CoastlineAttribution.read();
  }
  return null;
}

export function captureAttribution() {
  if (typeof window === "undefined") return null;
  if (window.CoastlineAttribution && typeof window.CoastlineAttribution.capture === "function") {
    return window.CoastlineAttribution.capture();
  }
  return readAttribution();
}

/** Attach anonymous click attribution to the Sticky order payload. */
export function appendAttributionFields(formData) {
  const attr = readAttribution() || {};
  ATTRIBUTION_FIELDS.forEach((key) => {
    formData.append(key, attr[key] || "");
  });
  return attr;
}
