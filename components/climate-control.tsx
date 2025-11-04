"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { VehicleState } from "@/types/vehicle"

interface ClimateControlProps {
  vehicleState: VehicleState
}

export default function ClimateControl({ vehicleState }: ClimateControlProps) {
  const [tempLeft, setTempLeft] = useState(21)
  const [tempRight, setTempRight] = useState(21)
  const [fanSpeed, setFanSpeed] = useState(50)
  const [mode, setMode] = useState<"cool" | "heat" | "auto">("auto")

  const modes = ["cool", "heat", "auto"] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature Controls */}
        <div className="space-y-6">
          {/* Driver Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-lg p-6 border border-border hover:border-accent/50 transition-smooth"
          >
            <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Driver Temp</div>
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => setTempLeft(Math.max(15, tempLeft - 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded border border-border hover:border-accent text-accent font-bold text-lg transition-colors"
              >
                −
              </motion.button>
              <motion.div
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center flex-1"
              >
                <motion.div
                  key={tempLeft}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-accent"
                >
                  {tempLeft}°
                </motion.div>
                <div className="text-xs text-muted-foreground">°C</div>
              </motion.div>
              <motion.button
                onClick={() => setTempLeft(Math.min(32, tempLeft + 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded border border-border hover:border-accent text-accent font-bold text-lg transition-colors"
              >
                +
              </motion.button>
            </div>
          </motion.div>

          {/* Passenger Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-background rounded-lg p-6 border border-border hover:border-accent/50 transition-smooth"
          >
            <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Passenger Temp</div>
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => setTempRight(Math.max(15, tempRight - 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded border border-border hover:border-accent text-accent font-bold text-lg transition-colors"
              >
                −
              </motion.button>
              <motion.div
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center flex-1"
              >
                <motion.div
                  key={tempRight}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-accent"
                >
                  {tempRight}°
                </motion.div>
                <div className="text-xs text-muted-foreground">°C</div>
              </motion.div>
              <motion.button
                onClick={() => setTempRight(Math.min(32, tempRight + 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded border border-border hover:border-accent text-accent font-bold text-lg transition-colors"
              >
                +
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* System Controls */}
        <div className="space-y-6">
          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-lg p-6 border border-border hover:border-accent/50 transition-smooth"
          >
            <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Mode</div>
            <div className="space-y-2">
              {modes.map((m, idx) => (
                <motion.button
                  key={m}
                  onClick={() => setMode(m)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className={`w-full py-3 rounded font-bold text-sm transition-smooth uppercase ${
                    mode === m
                      ? "bg-accent text-background border border-accent shadow-lg shadow-accent/30"
                      : "bg-card text-accent border border-border hover:border-accent/50"
                  }`}
                >
                  {m}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Fan Speed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-background rounded-lg p-6 border border-border hover:border-accent/50 transition-smooth"
          >
            <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Fan Speed</div>
            <input
              type="range"
              min="0"
              max="100"
              value={fanSpeed}
              onChange={(e) => setFanSpeed(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>OFF</span>
              <motion.span
                key={fanSpeed}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-accent font-bold"
              >
                {fanSpeed}%
              </motion.span>
              <span>MAX</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Current Conditions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 pt-8 border-t border-border"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Inside Temp", value: `${vehicleState.temperature}°C`, icon: "🌡" },
            { label: "Humidity", value: "45%", icon: "💧" },
            { label: "Seat Heat", value: "OFF", icon: "🔥" },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + idx * 0.05 }}
              className="bg-background rounded-lg p-4 text-center border border-border hover:border-accent/50 transition-smooth"
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-bold">{item.label}</div>
              <div className="text-2xl font-bold text-accent">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
