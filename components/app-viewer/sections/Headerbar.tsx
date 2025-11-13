// components/app-viewer/sections/HeaderBar.tsx
"use client";

import React from "react";
import { ArrowLeft, X, Sun, Moon } from "lucide-react";
import { getAppMeta } from "@/components/app-viewer/app-meta";

interface HeaderBarProps {
  onBack: () => void;
  onClose: () => void;
  theme: "light" | "dark";
  onToggleTheme: (t?: "light" | "dark") => void;
  currentApp?: string;
}

export default function HeaderBar({
  onBack,
  onClose,
  theme,
  onToggleTheme,
  currentApp = "maps",
}: HeaderBarProps) {
  const { title, logoPath, color } = getAppMeta(currentApp);

  // ✅ Auto-theme broadcasting for status-bar.tsx
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    onToggleTheme(newTheme);

    window.dispatchEvent(
      new CustomEvent("navi:theme:change", {
        detail: { theme: newTheme },
      })
    );
  };

  const style = {
    light: {
      bg: "bg-white/80 backdrop-blur-2xl",
      text: "text-gray-900",
      sub: "text-gray-600",
      border: "border-gray-200/50",
      button: "bg-black/10 hover:bg-black/20 text-gray-900",
      appIconBg: `bg-gradient-to-br ${color}`,
    },
    dark: {
      bg: "bg-black/60 backdrop-blur-2xl",
      text: "text-white",
      sub: "text-gray-300",
      border: "border-gray-600/30",
      button: "bg-white/10 hover:bg-white/20 text-white",
      appIconBg: `bg-gradient-to-br ${color}`,
    },
  }[theme];

  return (
    <div
      className={`p-4 flex items-center justify-between border-b ${style.bg} ${style.text} ${style.border}`}
    >
      {/* LEFT - App Info */}
      <div className="flex items-center gap-3">
        {/* App Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${style.appIconBg}`}
        >
          {logoPath ? (
            <img
              src={logoPath}
              alt={`${title} Logo`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-xl">{logoPath}</div>
          )}
        </div>

        <div>
          <div className="font-semibold text-base">{title}</div>
          <div className={`text-xs ${style.sub}`}>
            {currentApp === "maps" ? "Real-time Navigation" : "NaviCo Infotainment"}
          </div>
        </div>
      </div>

      {/* RIGHT - Controls */}
      <div className="flex items-center gap-2">
        {/* THEME TOGGLE */}
        <button
          onClick={handleThemeToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${style.button}`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* NAV Buttons */}
        <button
          onClick={onBack}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${style.button}`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${style.button} hover:bg-red-500/20 hover:text-red-300`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
