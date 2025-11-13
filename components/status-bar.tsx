// components/status-bar.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import type { VehicleState } from "@/types/vehicle";
import { Sun, Moon } from "lucide-react";

interface StatusBarProps {
  vehicleState: VehicleState;
  onBackToMenu?: () => void;
}

export default function StatusBar({
  vehicleState,
  onBackToMenu,
}: StatusBarProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  // ✅ Theme updates from HeaderBar
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail?.theme) setTheme(e.detail.theme);
    };
    window.addEventListener("navi:theme:change", handleThemeChange);
    return () => window.removeEventListener("navi:theme:change", handleThemeChange);
  }, [setTheme]);

  return (
    <div className="h-20 bg-card border-b border-border flex items-center justify-between px-6 gap-8 transition-smooth">
      {/* Back Button */}
      {onBackToMenu && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToMenu}
          className="p-2 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/10 text-lg"
          title="Back to Main Menu"
        >
          ←
        </motion.button>
      )}

      {/* Time + Ignition */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground font-medium">
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
        <div
          className={`w-2 h-2 rounded-full transition-all ${
            vehicleState.ignitionOn ? "bg-green-500 animate-pulse" : "bg-gray-500"
          }`}
        />
      </div>

      {/* Center Cluster */}
      <div className="flex-1 flex items-center justify-center gap-12">
        {/* Battery Voltage */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
            Battery
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-accent">
              {vehicleState.voltage.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">V</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
            Temp
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-accent">
              {vehicleState.temperature}
            </span>
            <span className="text-xs text-muted-foreground">°C</span>
          </div>
        </div>

        {/* Recording */}
        {vehicleState.recording && (
          <div className="text-center animate-fade-in">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Recording
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-500">ON</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Theme Toggle Only */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg border border-border hover:border-accent hover:bg-accent/10"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-accent" />
        ) : (
          <Moon className="w-5 h-5 text-accent" />
        )}
      </motion.button>
    </div>
  );
}