/**
 * First-party attribution cookie for .coastlinemeds.com.
 * Last paid click wins. No customer, health, or quiz data is stored.
 * Loaded by checkout and safe to include on the Lovable marketing site.
 */
(function () {
  var COOKIE = "cm_attr";
  var MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
  var KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "ttclid",
  ];

  function sanitize(value) {
    if (!value) return "";
    return String(value).replace(/[\r\n\t;]/g, "").trim().slice(0, 300);
  }

  function domainAttribute() {
    var host = window.location.hostname;
    if (host === "coastlinemeds.com" || host.endsWith(".coastlinemeds.com")) {
      return "; domain=.coastlinemeds.com";
    }
    return "";
  }

  function read() {
    var parts = document.cookie ? document.cookie.split("; ") : [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(COOKIE + "=") === 0) {
        try {
          return JSON.parse(decodeURIComponent(parts[i].slice(COOKIE.length + 1)));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  function write(data) {
    var secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      COOKIE +
      "=" +
      encodeURIComponent(JSON.stringify(data)) +
      "; path=/; max-age=" +
      MAX_AGE_SECONDS +
      "; SameSite=Lax" +
      domainAttribute() +
      secure;
  }

  function emptyRecord(landing, timestamp) {
    var record = {
      landing_page_url: landing,
      first_visit_at: timestamp,
    };
    for (var i = 0; i < KEYS.length; i++) record[KEYS[i]] = "";
    return record;
  }

  function capture() {
    var params = new URLSearchParams(window.location.search);
    var incoming = {};
    var hasNewAd = false;
    for (var i = 0; i < KEYS.length; i++) {
      var value = sanitize(params.get(KEYS[i]) || "");
      if (value) {
        incoming[KEYS[i]] = value;
        hasNewAd = true;
      }
    }

    var existing = read();
    if (!hasNewAd) {
      if (existing) return existing;
      var first = emptyRecord(
        window.location.origin + window.location.pathname,
        new Date().toISOString()
      );
      write(first);
      return first;
    }

    var next = emptyRecord(
      window.location.origin + window.location.pathname,
      new Date().toISOString()
    );
    for (var j = 0; j < KEYS.length; j++) {
      next[KEYS[j]] = incoming[KEYS[j]] || "";
    }
    write(next);
    return next;
  }

  window.CoastlineAttribution = {
    cookieName: COOKIE,
    keys: KEYS,
    capture: capture,
    read: read,
  };
  capture();
})();
