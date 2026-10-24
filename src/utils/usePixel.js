import { useEffect } from "react";

const usePixel = () => {
  useEffect(() => {
    // Avoid duplicate script insertion
    if (!window.gtag) {
      // Google GTAG
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-RM1HWM3138";
      document.head.appendChild(gtagScript);

      const gtagInlineScript = document.createElement("script");
      gtagInlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-RM1HWM3138', { send_page_view: false });
      `;
      document.head.appendChild(gtagInlineScript);
    }
  }, []);
};

export default usePixel;
