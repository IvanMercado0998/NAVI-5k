// components/app-viewer/maps/MapContainer.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadLeafletOnce } from "./useLeafletMap";
import { ghSearch, ghRoute } from "./useGraphhopper";
import { useTracking } from "./useTracking";
import VoiceButton from "components/app-viewer/voice/VoiceButton";
import { Search, Navigation, MapPin, Route, Mic, X, Compass, Sun, Moon, Locate } from "lucide-react";

export default function MapContainer() {
  const mapsRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const routeLayerRef = useRef<any | null>(null);
  const tileLayerRef = useRef<any | null>(null);

  const [leafletReady, setLeafletReady] = useState(false);
  const [query, setQuery] = useState("");
  const [routeInfo, setRouteInfo] = useState<any | null>(null);
  const [tracking, setTracking] = useState(false);
  const [listeningState, setListeningState] = useState<"idle" | "listening" | "accepted">("idle");
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Theme state that communicates with HeaderBar
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const { startTracking, stopTracking } = useTracking();

  // Theme configuration
  const themeConfig = {
    light: {
      mapTiles: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      bg: "bg-white",
      searchBg: "bg-white/95",
      searchBorder: "border-gray-200",
      searchText: "text-gray-900",
      searchPlaceholder: "text-gray-500",
      panelBg: "bg-white/95",
      panelBorder: "border-gray-200",
      panelText: "text-gray-900",
      panelSubtext: "text-gray-600",
      buttonBg: "bg-blue-600",
      buttonHover: "bg-blue-700",
      buttonBorder: "border-blue-400/30",
      secondaryButton: "bg-gray-100",
      secondaryHover: "bg-gray-200",
      icon: "text-gray-700",
      routeColor: "#2563eb",
      markerColor: "bg-red-500",
      trackingColor: "bg-green-500"
    },
    dark: {
      mapTiles: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      bg: "bg-gray-900",
      searchBg: "bg-gray-800/95",
      searchBorder: "border-gray-600/30",
      searchText: "text-white",
      searchPlaceholder: "text-gray-400",
      panelBg: "bg-gray-800/95",
      panelBorder: "border-gray-600/30",
      panelText: "text-white",
      panelSubtext: "text-gray-400",
      buttonBg: "bg-blue-600",
      buttonHover: "bg-blue-700",
      buttonBorder: "border-blue-400/30",
      secondaryButton: "bg-gray-700",
      secondaryHover: "bg-gray-600",
      icon: "text-gray-300",
      routeColor: "#007AFF",
      markerColor: "bg-red-500",
      trackingColor: "bg-green-500"
    }
  };

  const currentTheme = themeConfig[theme];

  // Listen for theme changes from HeaderBar
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail.theme;
      if (newTheme === 'light' || newTheme === 'dark') {
        setTheme(newTheme);
      }
    };

    window.addEventListener('navi:theme:change', handleThemeChange as EventListener);
    return () => window.removeEventListener('navi:theme:change', handleThemeChange as EventListener);
  }, []);

  // Get current location via GPS
const getCurrentLocation = async () => {
  setLocationLoading(true);
  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve, 
        (error) => {
          // Provide more specific error messages
          let errorMessage = "Unable to get your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting your location.";
              break;
          }
          reject(new Error(errorMessage));
        }, 
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 60000 // Cache for 1 minute
        }
      );
    });

    const { latitude, longitude } = position.coords;
    
    console.log("GPS Coordinates:", latitude, longitude);
    
    // Get address from coordinates
    let address = "Current Location";
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (!response.ok) throw new Error("Geocoding failed");
      
      const data = await response.json();
      if (data.display_name) {
        address = data.display_name.split(',').slice(0, 2).join(', '); // Get city/country
      }
    } catch (error) {
      console.warn("Could not fetch address, using coordinates:", error);
      address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    const location = { lat: latitude, lng: longitude, address };
    setCurrentLocation(location);

    // Center map on current location
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 15);
      
      // Update or create marker
      if (!markerRef.current) {
        const L = (window as any).L;
        const customIcon = L.divIcon({
          html: `<div class="w-6 h-6 ${currentTheme.markerColor} rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
          className: 'custom-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapInstanceRef.current);
      } else {
        markerRef.current.setLatLng([latitude, longitude]);
      }
      markerRef.current.bindPopup(`<div class='text-sm font-semibold'>${address}</div>`).openPopup();
    }

  } catch (error) {
    console.error("Error getting location:", error);
    
    // Show user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Unable to get your current location.";
    
    // Fallback to a default location (Manila)
    const fallbackLocation = { lat: 14.5995, lng: 120.9842, address: "Manila, Philippines" };
    setCurrentLocation(fallbackLocation);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([fallbackLocation.lat, fallbackLocation.lng], 12);
    }
    
    // Only show alert for permission-related errors
    if (error instanceof Error && error.message.includes("denied")) {
      alert(errorMessage);
    }
  } finally {
    setLocationLoading(false);
  }
};

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLeafletOnce();
        if (!mounted) return;
        setLeafletReady(true);
      } catch (err) {
        console.error("Leaflet load failed", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapsRef.current) return;
    const L = (window as any).L;
    if (!L) return;
    
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapsRef.current, { 
        zoomControl: true,
        attributionControl: true
      }).setView([14.5995, 120.9842], 12);

      // Set initial tile layer based on theme
      tileLayerRef.current = L.tileLayer(currentTheme.mapTiles, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Custom marker
      const customIcon = L.divIcon({
        html: `<div class="w-6 h-6 ${currentTheme.markerColor} rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      markerRef.current = L.marker([14.5995, 120.9842], { icon: customIcon }).addTo(mapInstanceRef.current);
      markerRef.current.bindPopup("<div class='text-sm font-semibold'>Current Location</div>").openPopup();

      if (mapsRef.current?.parentElement) {
        mapsRef.current.parentElement.style.position = "relative";
      }

      // Auto-detect location on mount
      getCurrentLocation();
    }
  }, [leafletReady]);

  // Update map tiles when theme changes
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const L = (window as any).L;
      tileLayerRef.current = L.tileLayer(currentTheme.mapTiles, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }
  }, [theme]);

  const doSearch = async (q?: string) => {
    const theQuery = (q ?? query)?.trim();
    if (!theQuery || !mapInstanceRef.current) return;
    try {
      const gh = await ghSearch(theQuery);
      if (gh?.hits?.length) {
        const first = gh.hits[0];
        const lat = first.point?.lat;
        const lng = first.point?.lng;
        const name = first.name ?? theQuery;
        if (lat != null && lng != null) {
          mapInstanceRef.current.setView([lat, lng], 15);
          if (!markerRef.current) {
            const L = (window as any).L;
            const customIcon = L.divIcon({
              html: `<div class="w-6 h-6 ${currentTheme.markerColor} rounded-full border-2 border-white shadow-lg"></div>`,
              className: 'custom-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);
          } else {
            markerRef.current.setLatLng([lat, lng]);
          }
          markerRef.current.bindPopup(`<div class='text-sm font-semibold'>${name}</div>`).openPopup();
        }
        return;
      }

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(theQuery)}`);
      const j = await res.json();
      if (!Array.isArray(j) || j.length === 0) return alert("Location not found");
      const lat = +j[0].lat;
      const lon = +j[0].lon;
      mapInstanceRef.current.setView([lat, lon], 15);
      if (!markerRef.current) {
        const L = (window as any).L;
        const customIcon = L.divIcon({
          html: `<div class="w-6 h-6 ${currentTheme.markerColor} rounded-full border-2 border-white shadow-lg"></div>`,
          className: 'custom-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapInstanceRef.current);
      } else {
        markerRef.current.setLatLng([lat, lon]);
      }
      markerRef.current.bindPopup(`<div class='text-sm font-semibold'>${j[0].display_name}</div>`).openPopup();
    } catch (err) {
      console.error("doSearch error", err);
      alert("Search failed");
    }
  };

  const calculateRoute = async () => {
    if (!mapInstanceRef.current || !markerRef.current) return alert("Map or marker missing");
    const center = currentLocation ? [currentLocation.lat, currentLocation.lng] : [mapInstanceRef.current.getCenter().lat, mapInstanceRef.current.getCenter().lng];
    const dest = [markerRef.current.getLatLng().lat, markerRef.current.getLatLng().lng] as [number, number];

    try {
      if (window.electronAPI?.graphhopper?.route) {
        const res = await window.electronAPI.graphhopper.route({ lat: center[0], lng: center[1] }, { lat: dest[0], lng: dest[1] });
        const path = res?.paths?.[0];
        const points = path?.points?.coordinates ?? path?.points;
        if (Array.isArray(points) && points.length) {
          const coords = points.map((c: any) => [c[1], c[0]]);
          if (routeLayerRef.current) {
            try {
              mapInstanceRef.current.removeLayer(routeLayerRef.current);
            } catch {}
            routeLayerRef.current = null;
          }
          const L = (window as any).L;
          routeLayerRef.current = L.polyline(coords, { 
            color: currentTheme.routeColor, 
            weight: 6, 
            opacity: 0.8 
          }).addTo(mapInstanceRef.current);
          mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
          setRouteInfo({ distance: path?.distance ?? 0, time: path?.time ?? 0, steps: path?.instructions ?? [] });
          return;
        }
      }
    } catch (err) {
      console.warn("GraphHopper failed, falling back to OSRM", err);
    }

    try {
      const coords = `${center[1]},${center[0]};${dest[1]},${dest[0]}`;
      const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`);
      const j = await r.json();
      const route = j?.routes?.[0];
      if (!route) return alert("No route");
      const coordsArr = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
      if (routeLayerRef.current) {
        try {
          mapInstanceRef.current.removeLayer(routeLayerRef.current);
        } catch {}
        routeLayerRef.current = null;
      }
      const L = (window as any).L;
      routeLayerRef.current = L.polyline(coordsArr, { 
        color: currentTheme.routeColor, 
        weight: 6, 
        opacity: 0.8 
      }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
      setRouteInfo({ distance: route.distance, duration: route.duration, steps: [] });
    } catch (err) {
      console.error("OSRM error", err);
      alert("Routing failed");
    }
  };

  const handleStartTracking = () => {
    const id = startTracking(
      (lat: number, lon: number) => {
        try {
          if (!mapInstanceRef.current) return;
          mapInstanceRef.current.setView([lat, lon], 16);
          if (!markerRef.current) {
            const L = (window as any).L;
            const customIcon = L.divIcon({
              html: `<div class="w-6 h-6 ${currentTheme.trackingColor} rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
              className: 'custom-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapInstanceRef.current);
          } else {
            markerRef.current.setLatLng([lat, lon]);
          }
        } catch (err) {
          console.error("tracking set view error", err);
        }
      },
      (err) => {
        console.error("tracking error", err);
        alert("Tracking error: " + (err?.message ?? String(err)));
      }
    );
    if (id) setTracking(true);
  };

  const handleStopTracking = () => {
    stopTracking();
    setTracking(false);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const text = ev.detail?.text;
      if (text) {
        setQuery(text);
        doSearch(text);
        setListeningState("accepted");
        setTimeout(() => setListeningState("idle"), 1500);
      }
    };
    window.addEventListener("navi:voice:accepted", handler as EventListener);
    return () => window.removeEventListener("navi:voice:accepted", handler as EventListener);
  }, []);

  const clearRoute = () => {
    try {
      if (routeLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
    } catch {}
    routeLayerRef.current = null;
    setRouteInfo(null);
  };

  return (
    <div className={`w-full h-full relative ${currentTheme.bg}`}>
      {/* Modern Search Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[1000]">
        <div className={`flex items-center backdrop-blur-xl rounded-2xl p-3 shadow-2xl border transition-all duration-300 ${
          searchFocused ? 'ring-2 ring-blue-500/50' : ''
        } ${currentTheme.searchBg} ${currentTheme.searchBorder}`}>
          <Search className={`w-5 h-5 ml-2 mr-3 ${currentTheme.searchPlaceholder}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search location or use voice command..."
            className={`flex-1 bg-transparent placeholder:${currentTheme.searchPlaceholder} outline-none text-lg py-1 ${currentTheme.searchText}`}
          />
          
          {query && (
            <button
              onClick={() => setQuery("")}
              className={`p-1 ${currentTheme.secondaryButton} hover:${currentTheme.secondaryHover} rounded-full transition-colors mr-2`}
            >
              <X className={`w-4 h-4 ${currentTheme.icon}`} />
            </button>
          )}
          
          <VoiceButton
            onStateChange={(s) => setListeningState(s)}
            onTranscription={(text) => {
              window.dispatchEvent(new CustomEvent("navi:voice:accepted", { detail: { text } }));
            }}
          />
        </div>

        {/* Voice Status Indicator */}
        {listeningState !== "idle" && (
          <div className="mt-3 flex justify-center">
            <div className={`px-4 py-2 rounded-full backdrop-blur-sm border ${
              listeningState === "listening" 
                ? `bg-yellow-500/20 border-yellow-500/50 ${theme === "dark" ? "text-yellow-300" : "text-yellow-600"}` 
                : `bg-green-500/20 border-green-500/50 ${theme === "dark" ? "text-green-300" : "text-green-600"}`
            }`}>
              {listeningState === "listening" ? "🎤 Listening..." : "✅ Command accepted"}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-32 right-6 z-[999] flex flex-col gap-3">
        <button
          onClick={() => doSearch()}
          className={`p-4 rounded-2xl shadow-2xl border transition-all duration-200 hover:scale-105 group ${
            currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonBorder}`}
          title="Search"
        >
          <Search className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => calculateRoute()}
          className={`p-4 rounded-2xl shadow-2xl border transition-all duration-200 hover:scale-105 group ${
            currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonBorder}`}
          title="Calculate Route"
        >
          <Route className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={tracking ? handleStopTracking : handleStartTracking}
          className={`p-4 rounded-2xl shadow-2xl border transition-all duration-200 hover:scale-105 group ${
            tracking 
              ? "bg-red-600 hover:bg-red-700 border-red-400/30" 
              : `${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonBorder}`
          }`}
          title={tracking ? "Stop Tracking" : "Start Tracking"}
        >
          <Navigation className={`w-6 h-6 text-white ${tracking ? 'animate-pulse' : ''}`} />
        </button>

        {/* GPS Location Button */}
        <button
          onClick={getCurrentLocation}
          disabled={locationLoading}
          className={`p-4 rounded-2xl shadow-2xl border transition-all duration-200 hover:scale-105 group ${
            locationLoading 
              ? "bg-gray-600 cursor-not-allowed" 
              : `${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonBorder}`
          }`}
          title="Get Current Location"
        >
          <Locate className={`w-6 h-6 text-white ${locationLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapsRef} className="w-full h-full" />

{/* Route Info Panel - Glass Morphism Design */}
{routeInfo && (
  <div className={`absolute right-6 bottom-6 z-[999] w-96 max-h-[60vh] rounded-3xl shadow-2xl border overflow-hidden ${
    theme === "dark" 
      ? "bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/90 backdrop-blur-2xl border-white/10" 
      : "bg-gradient-to-br from-white/90 via-blue-50/80 to-white/95 backdrop-blur-2xl border-gray-200/50"
  }`}>
    
    {/* Header with glass effect */}
    <div className={`p-5 border-b ${
      theme === "dark" ? "border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent" : "border-gray-200/50 bg-gradient-to-r from-blue-100/50 to-transparent"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon with glass background */}
          <div className={`p-3 rounded-2xl backdrop-blur-sm ${
            theme === "dark" 
              ? "bg-blue-500/20 border border-blue-400/30" 
              : "bg-blue-500/15 border border-blue-400/20"
          }`}>
            <Route className={`w-6 h-6 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`} />
          </div>
          
          {/* Route Info */}
          <div>
            <div className={`font-bold text-xl ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {(((routeInfo.distance ?? 0) / 1000) || 0).toFixed(1)} km
            </div>
            <div className={`text-sm font-medium ${
              theme === "dark" ? "text-blue-300/80" : "text-blue-600/80"
            }`}>
              {Math.ceil(((routeInfo.duration ?? routeInfo.time) ?? 0) / 60)} minutes
            </div>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={clearRoute}
          className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
            theme === "dark" 
              ? "bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 border border-white/10" 
              : "bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 border border-gray-200"
          }`}
          title="Clear route"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* Steps List */}
    <div className="max-h-64 overflow-y-auto">
      {Array.isArray(routeInfo.steps) && routeInfo.steps.length === 0 ? (
        <div className={`p-6 text-center ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}>
          <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
            theme === "dark" 
              ? "bg-blue-500/20 border border-blue-400/30" 
              : "bg-blue-500/15 border border-blue-400/20"
          }`}>
            <Compass className={`w-6 h-6 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`} />
          </div>
          <div className="font-medium">Turn-by-turn navigation</div>
          <div className="text-sm opacity-75">Detailed instructions available</div>
        </div>
      ) : (
        <div className="p-3">
          {Array.isArray(routeInfo.steps) &&
            routeInfo.steps.map((s: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-2xl mb-2 cursor-pointer transition-all duration-200 group hover:scale-[1.02] ${
                  theme === "dark" 
                    ? "bg-white/5 hover:bg-white/10 border border-white/5" 
                    : "bg-gray-50/80 hover:bg-white border border-gray-100"
                }`}
                onClick={() => s.location && mapInstanceRef.current?.setView(s.location, 17)}
              >
                {/* Step Indicator */}
                <div className={`w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-150 ${
                  theme === "dark" 
                    ? "bg-blue-400 shadow-lg shadow-blue-400/25" 
                    : "bg-blue-500 shadow-lg shadow-blue-500/25"
                }`}></div>
                
                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm leading-tight ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {s.instruction ?? s.text ?? "Continue straight"}
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${
                    theme === "dark" ? "text-blue-300/80" : "text-blue-600/80"
                  }`}>
                    {((s.distance ?? 0) / 1000).toFixed(2)} km
                  </div>
                </div>
                
                {/* Hover Arrow */}
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  theme === "dark" ? "text-blue-300" : "text-blue-500"
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>

    {/* Bottom Gradient Fade */}
    <div className={`h-8 bg-gradient-to-t ${
      theme === "dark" 
        ? "from-gray-900/80 to-transparent" 
        : "from-white/90 to-transparent"
    } pointer-events-none`} />
  </div>
)}

      {/* Current Location Indicator with GPS Data */}
      <div className="absolute bottom-6 left-6 z-[999]">
        <div className={`flex items-center gap-2 px-4 py-2 backdrop-blur-xl rounded-2xl border ${
          currentTheme.panelBg} ${currentTheme.panelBorder}`}>
          <MapPin className={`w-4 h-4 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`} />
          <span className={currentTheme.panelText}>
            {currentLocation?.address || "Getting location..."}
          </span>
          {locationLoading && (
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    </div>
  );
}