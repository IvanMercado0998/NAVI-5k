// components/navigation.tsx
/**
 * NAVI Infotainment System - Application Navigation Sidebar
 * 
 * @component
 * @description
 * Vertical navigation sidebar providing quick access to all NAVI infotainment applications.
 * Features categorized app organization, visual feedback, and audio-enhanced interactions
 * for a professional automotive user experience.
 * 
 * @version 1.0.0
 * @author Ivan Mercado
 * @created 2025
 * 
 * @features
 * - Categorized application organization (Media, Browser, Navigation, Vehicle, System)
 * - Visual active state indicators with accent colors
 * - Animated hover and tap interactions using Framer Motion
 * - Integrated audio feedback on app selection
 * - Fallback emoji icons for missing application logos
 * - Compact sidebar design optimized for automotive displays
 * - Responsive layout with smooth transitions
 * 
 * @props {string} activeApp - Currently active application identifier
 * @props {function} setActiveApp - Callback to update active application state
 * @props {function} onAppLaunch - Callback executed when application is launched
 * 
 * @audio
 * - Path: /sounds/tap-sound.mp3
 * - Format: MP3
 * - Timing: Plays on application selection
 * - Purpose: Provides tactile audio feedback for navigation interactions
 * 
 * @categories
 * - Media: Video and music streaming applications
 * - Browser: Web browsing and internet access
 * - Navigation: Maps and location services
 * - Vehicle: Camera systems and vehicle controls
 * - System: Settings and configuration panels
 * 
 * @applications
 * - YouTube: Video streaming platform
 * - YT Music: Music streaming service
 * - Spotify: Premium music streaming
 * - Brave: Privacy-focused web browser
 * - Maps: Navigation and location services
 * - Cameras: 360° vehicle camera system
 * - Controls: Vehicle control interface
 * - Settings: System configuration panel
 * 
 * @animations
 * - Staggered app icon entrance animations
 * - Scale-based hover effects
 * - Smooth tap interactions
 * - Opacity transitions for visual feedback
 * 
 * @design
 * - Fixed-width sidebar layout (96px)
 * - Category-based visual organization
 * - Color-coded active states with accent colors
 * - Compact icon sizing with proper aspect ratios
 * - Accessibility-compliant contrast ratios
 * - Professional typography hierarchy
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface NavigationProps {
  activeApp: string;
  setActiveApp?: (app: string) => void;
  onAppLaunch?: (app: string) => void;
}

interface AppItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  category?: string;
}

export default function Navigation({ activeApp, setActiveApp, onAppLaunch }: NavigationProps) {
  const [internalActiveApp, setInternalActiveApp] = useState(activeApp || "home");

  // FIX: Add audio handler for navigation interactions
  const playTapSound = () => {
    const audio = new Audio('/sounds/tap-sound.mp3');
    audio.volume = 0.9; // Reduced volume for subtle navigation feedback
    audio.play().catch(error => {
      console.log('Navigation tap sound play failed:', error);
    });
  };

  // FIX: Enhanced app click handler with audio feedback
  const handleAppClick = (appId: string) => {
    playTapSound(); // Play audio feedback on app selection
    setInternalActiveApp(appId);
    setActiveApp?.(appId);
    onAppLaunch?.(appId);
  };

  // ✅ App list (matches AppMenu + StatusBar icons)
  const apps: AppItem[] = [
    { id: "youtube",        name: "YouTube",       logo: "/logos/youtube.png",    description: "Video Streaming",        category: "media" },
    { id: "youtube-music",  name: "YT Music",      logo: "/logos/YTMusic.png",     description: "Music Streaming",        category: "media" },
    { id: "spotify",        name: "Spotify",       logo: "/logos/spotify.png",     description: "Music Streaming",        category: "media" },
    { id: "brave",          name: "Brave Browser", logo: "/logos/brave.png",       description: "Secure Web Browser",     category: "browser" },
    { id: "maps",           name: "Maps",          logo: "/logos/googlemaps.png",  description: "Navigation System",       category: "navigation" },
    { id: "camera",         name: "Cameras",       logo: "",                        description: "360° Camera System",     category: "vehicle" },
    { id: "controls",       name: "Controls",      logo: "",                        description: "Vehicle Controls",       category: "vehicle" },
    { id: "settings",       name: "Settings",      logo: "",                        description: "System Settings",        category: "system" },
  ];

  // ✅ Emoji fallback icons
  const getFallbackIcon = (id: string) => {
    const icons: Record<string, string> = {
      youtube: "▶️",
      "youtube-music": "🎵",
      spotify: "🎵",
      brave: "🦁",
      maps: "🗺️",
      camera: "📷",
      controls: "⚙️",
      settings: "🔧",
    };
    return icons[id] || "📱";
  };

  // ✅ Category labels
  const categories = {
    media: "Media",
    browser: "Browser",
    navigation: "Navigation",
    vehicle: "Vehicle",
    system: "System",
  };

  // ✅ Group apps by category
  const appsByCategory = apps.reduce((acc, app) => {
    const cat = app.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(app);
    return acc;
  }, {} as Record<string, AppItem[]>);

  const currentActiveApp = activeApp || internalActiveApp;

  return (
    <nav
      className="
        bg-card border-r border-border 
        w-24 min-w-24 max-w-24
        flex flex-col items-center 
        py-4 gap-8
        overflow-y-auto
        transition-all
      "
    >
      {/* ✅ Header */}
      <div className="text-center w-full mb-4">
        <h3 className="text-xs font-bold tracking-widest text-muted-foreground">APPS</h3>
      </div>

      {/* ✅ Apps List */}
      {Object.entries(appsByCategory).map(([category, group]) => (
        <div key={category} className="w-full mb-6 px-2">
          {/* Category Title */}
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 text-center">
            {categories[category]}
          </h4>

          {/* Icons */}
          <div className="flex flex-col gap-3 items-center">
            {group.map((app, idx) => (
              <motion.button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`
                  w-12 h-12 rounded-xl 
                  flex items-center justify-center
                  border-2 transition-all
                  ${currentActiveApp === app.id
                    ? "border-accent bg-accent/10 shadow-md shadow-accent/20"
                    : "border-border hover:border-accent/50 hover:bg-secondary/40"
                  }
                `}
              >
                {/* PNG or Emoji fallback */}
                {app.logo ? (
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      fallback.classList.remove("hidden");
                    }}
                  />
                ) : null}

                {/* Fallback Icon */}
                <span className={`text-xl ${app.logo ? "hidden" : ""}`}>
                  {getFallbackIcon(app.id)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}