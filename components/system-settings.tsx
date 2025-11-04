"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface SystemSettingsProps {
  onAppLaunch?: (app: string) => void
}

export default function SystemSettings({ onAppLaunch }: SystemSettingsProps) {
  const [recordingEnabled, setRecordingEnabled] = useState(true)
  const [sentryMode, setSentryMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  const SettingItem = ({
    label,
    description,
    value,
    onChange,
    type = "toggle",
  }: {
    label: string
    description: string
    value: boolean | string
    onChange: (val: boolean | string) => void
    type?: "toggle" | "slider" | "select"
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-card border border-border rounded-lg flex items-center justify-between hover:border-accent/50 transition-smooth cursor-pointer"
    >
      <div>
        <div className="font-bold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
      {type === "toggle" && (
        <motion.button
          onClick={() => onChange(!value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-6 rounded-full border-2 flex items-center transition-smooth ${
            value ? "bg-accent/20 border-accent" : "bg-border/30 border-border"
          }`}
        >
          <motion.div
            animate={{ x: value ? 24 : 4 }}
            className={`w-4 h-4 rounded-full ${value ? "bg-accent" : "bg-muted-foreground"}`}
          />
        </motion.button>
      )}
    </motion.div>
  )

  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-secondary/5 p-6 overflow-auto">
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground mb-6">SYSTEM SETTINGS</h2>

        <div className="space-y-4">
          <SettingItem
            label="Recording"
            description="Enable continuous recording when engine is on"
            value={recordingEnabled}
            onChange={setRecordingEnabled}
          />

          <SettingItem
            label="Sentry Mode"
            description="Monitor vehicle when parked (drains battery)"
            value={sentryMode}
            onChange={setSentryMode}
          />

          <SettingItem
            label="Debug Mode"
            description="Show ESP32 serial protocol messages"
            value={debugMode}
            onChange={setDebugMode}
          />
        </div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">SYSTEM INFO</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Firmware Version", value: "2.1.0", color: "accent" },
              { label: "ESP32 Status", value: "Connected", color: "green" },
              { label: "Serial Port", value: "COM3 @ 115200", color: "accent" },
              { label: "Storage", value: "256 GB SSD", color: "accent" },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="flex justify-between p-3 bg-card rounded border border-border hover:border-accent/50 transition-smooth"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className={`font-bold ${item.color === "green" ? "text-green-500" : "text-accent"}`}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* NaviCo Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-border text-center"
        >
          <p className="text-accent font-bold mb-2">NAVI Infotainment System</p>
          <p className="text-xs text-muted-foreground mb-1">NaviCo | Est. 2025</p>
          <p className="text-xs text-muted-foreground">Founded by Ivan Mercado</p>
          <p className="text-xs text-muted-foreground mt-3">v1.0.0</p>
        </motion.div>
      </div>
    </div>
  )
}
