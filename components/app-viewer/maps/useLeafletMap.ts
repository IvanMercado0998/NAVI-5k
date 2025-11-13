// components/app-viewer/maps/useLeafletMap.ts
import { useEffect, useRef } from "react";

/**
 * Hook to ensure Leaflet is loaded and initialized.
 * Exposes map container ref usage via the map instance stored in caller refs.
 */
export async function loadLeafletOnce() {
  if (typeof window === "undefined") return;
  if ((window as any).__leafletLoaded) return;
  // add CSS if missing
  if (!document.querySelector('link[href*="leaflet.css"]')) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(l);
  }
  if (!document.getElementById("leaflet-js")) {
    const s = document.createElement("script");
    s.id = "leaflet-js";
    s.async = true;
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    await new Promise<void>((resolve, reject) => {
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load leaflet"));
      document.body.appendChild(s);
    });
  }
  (window as any).__leafletLoaded = true;
}
