// components/app-viewer/AppViewer.tsx
"use client";

import React, { useState } from "react";
import HeaderBar from "@/components/app-viewer/sections/Headerbar.tsx"; // components\app-viewer\sections\Headerbar.tsx
import FooterBar from "@/components/app-viewer/sections/FooterBar";
import MapContainer from "@/components/app-viewer/maps/MapContainer";
import YoutubePlayer from "@/components/app-viewer/media/YoutubePlayer";
import SpotifyPlayer from "@/components/app-viewer/spotify/SpotifyPlayer";
import BrowserControls from "@/components/app-viewer/browser/BrowserControls";
import { AppMeta } from "@/components/app-viewer/app-meta"; // Fixed import path

// Extended AppId type to include all possible apps
type AppId = "spotify" | "youtube" | "youtube-music" | "maps" | "brave" | "chrome" | "camera" | "controls" | "settings";

interface AppViewerProps {
  app: AppId;
  onClose: () => void;
  onBack: () => void;
  spotifyToken?: string;
  youtubeApiKey?: string;
  openBrowser?: (url: string) => void;
  // optional theme callback: status-bar.tsx can subscribe
  onThemeChange?: (theme: "light" | "dark") => void;
}

export default function AppViewer({
  app,
  onClose,
  onBack,
  spotifyToken,
  youtubeApiKey,
  openBrowser,
  onThemeChange,
}: AppViewerProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const h = new Date().getHours();
    return h < 7 || h >= 18 ? "dark" : "light";
  });

  const handleThemeToggle = (t?: "light" | "dark") => {
    const newTheme = t ?? (theme === "dark" ? "light" : "dark");
    setTheme(newTheme);
    onThemeChange?.(newTheme);
    // apply to body quickly
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  // Render appropriate content based on app
  const renderAppContent = () => {
    switch (app) {
      case "maps":
        return <MapContainer />;
      case "youtube":
      case "youtube-music":
        return <YoutubePlayer apiKey={youtubeApiKey} appMode={app} />;
      case "spotify":
        return <SpotifyPlayer token={spotifyToken} />;
      case "brave":
      case "chrome":
        return <BrowserControls openBrowser={openBrowser} />;
      case "camera":
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-xl font-semibold">Camera App</p>
              <p className="text-gray-500 dark:text-gray-400">Coming soon...</p>
            </div>
          </div>
        );
      case "controls":
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <p className="text-xl font-semibold">Controls</p>
              <p className="text-gray-500 dark:text-gray-400">Vehicle controls coming soon...</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-4">🔧</div>
              <p className="text-xl font-semibold">Settings</p>
              <p className="text-gray-500 dark:text-gray-400">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-xl font-semibold">NAVI Infotainment</p>
              <p className="text-gray-500 dark:text-gray-400">Select an app to begin</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <HeaderBar 
        onBack={onBack} 
        onClose={onClose} 
        theme={theme} 
        onToggleTheme={handleThemeToggle} 
        currentApp={app} // Pass the current app to HeaderBar
      />
      <div className="flex-1 relative">
        {renderAppContent()}
      </div>
      <FooterBar theme={theme} />
    </div>
  );
}