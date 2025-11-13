// components/app-viewer/maps/useTracking.ts
import { useRef } from "react";

export function useTracking() {
  const watchIdRef = useRef<number | null>(null);

  function startTracking(onPos: (lat: number, lon: number) => void, onErr?: (err: any) => void) {
    if (!("geolocation" in navigator)) {
      onErr?.(new Error("No geolocation"));
      return null;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => onPos(p.coords.latitude, p.coords.longitude),
      (e) => onErr?.(e),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    watchIdRef.current = id;
    return id;
  }

  function stopTracking() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  return { startTracking, stopTracking, watchIdRef };
}

