"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import type { VehicleState } from "@/types/vehicle"
import { Sun, Moon } from "lucide-react"

interface StatusBarProps {
  vehicleState: VehicleState
  onAppLaunch: (app: string) => void
  onBackToMenu?: () => void
}

export default function StatusBar({ vehicleState, onAppLaunch, onBackToMenu }: StatusBarProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  if (typeof window !== "undefined" && !mounted) {
    setMounted(true)
  }

  const batteryPercentage = Math.min(100, Math.max(0, ((vehicleState.voltage - 10.5) / (14.4 - 10.5)) * 100))

  const apps = [
    { id: "youtube", label: "▶", name: "YouTube", color: "red" },
    { id: "youtube-music", label: "♫", name: "YT Music", color: "red" },
    { id: "spotify", label: "🎵", name: "Spotify", color: "green" },
    { id: "chrome", label: "◉", name: "Chrome", color: "yellow" },
    { id: "maps", label: "🗺", name: "Maps", color: "green" },
    { id: "camera", label: "📷", name: "Camera", color: "blue" },
  ]

  return (
    <div className="h-20 bg-card border-b border-border flex items-center justify-between px-6 gap-8 transition-smooth">
      {onBackToMenu && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToMenu}
          className="p-2 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/10 transition-smooth text-lg"
          title="Back to Main Menu"
        >
          ←
        </motion.button>
      )}

      {/* Time & System Status */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground font-medium">
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </div>
        <div
          className={`w-2 h-2 rounded-full transition-all ${vehicleState.ignitionOn ? "bg-green-500 animate-pulse-glow" : "bg-gray-500"}`}
        />
      </div>

      {/* Center Status Indicators */}
      <div className="flex-1 flex items-center justify-center gap-12">
        {/* Voltage */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Battery</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-accent">{vehicleState.voltage.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">V</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Temp</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-accent">{vehicleState.temperature}</span>
            <span className="text-xs text-muted-foreground">°C</span>
          </div>
        </div>

        {/* Recording Status */}
        {vehicleState.recording && (
          <div className="text-center animate-fade-in">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Recording</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-500">ON</span>
            </div>
          </div>
        )}

        {/* Sentry Mode */}
        {vehicleState.sentryMode && (
          <div className="text-center animate-fade-in">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Sentry</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-bold text-accent">Active</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap justify-end">
        {apps.map((app) => (
          <motion.button
            key={app.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAppLaunch(app.id)}
            className="p-2 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-smooth-fast text-lg hover:shadow-lg"
            title={app.name}
          >
            {app.label}
          </motion.button>
        ))}
      </div>

      {/* Right Status Indicators & Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          {vehicleState.reverseOn && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded border border-red-500 animate-fade-in">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-red-500 uppercase">REV</span>
            </div>
          )}

          {vehicleState.turnSignalLeft && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded border border-yellow-500 animate-fade-in">
              <span className="text-sm">←</span>
              <span className="text-xs font-bold text-yellow-500 uppercase">TURN</span>
            </div>
          )}

          {vehicleState.turnSignalRight && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded border border-yellow-500 animate-fade-in">
              <span className="text-xs font-bold text-yellow-500 uppercase">TURN</span>
              <span className="text-sm">→</span>
            </div>
          )}

          {vehicleState.alarmTrip && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded border border-red-500 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-red-500 uppercase">ALARM</span>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-smooth-fast ml-2"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-accent" />}
        </motion.button>
      </div>
    </div>
  )
}
