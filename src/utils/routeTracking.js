import { GA4_MEASUREMENT_ID, gtagEvent } from "./gtag";
import { captureAttribution } from "./attribution";

export const META_PIXEL_ID = "1449418673442039";

const firedThisLoad = new Set();

function oncePerPageLoad(key, fn) {
  if (firedThisLoad.has(key)) return false;
  firedThisLoad.add(key);
  fn();
  return true;
}

/**
 * SPA page views. Checkout load also fires InitiateCheckout.
 * Query strings are never sent (they can carry emails or quiz answers).
 * Quiz question pages, intake, and the member portal are not in this app.
 */
export function trackRoute(pathname) {
  const path = pathname || "/";
  const attribution = captureAttribution();
  const pageLocation = `${window.location.origin}${path}`;
  const events = [];

  if (
    oncePerPageLoad(`page_${path}`, () => {
      gtagEvent("page_view", {
        page_path: path,
        page_location: pageLocation,
        page_title: document.title,
        send_to: GA4_MEASUREMENT_ID,
      });
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    })
  ) {
    events.push("page_view");
  }

  if (path === "/") {
    if (
      oncePerPageLoad("initiate_checkout", () => {
        if (typeof window.fbq === "function") {
          window.fbq("track", "InitiateCheckout");
        }
        gtagEvent("InitiateCheckout", {
          send_to: GA4_MEASUREMENT_ID,
        });
      })
    ) {
      events.push("InitiateCheckout");
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[coastline tracking]", {
      ga4: GA4_MEASUREMENT_ID,
      pixel: META_PIXEL_ID,
      path,
      events,
      attribution,
    });
  }

  const trackedEvents =
    path === "/" ? ["page_view", "InitiateCheckout"] : ["page_view"];

  return { path, events, trackedEvents, attribution };
}
