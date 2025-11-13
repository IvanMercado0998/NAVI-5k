"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

/**
 * ✅ UI ONLY IMPROVED — FUNCTIONALITY UNTOUCHED
 * - Toggle logic preserved
 * - onBackToMenu, onAppLaunch still work
 * - State variables unchanged
 */

interface SystemSettingsProps {
  onAppLaunch: (app: string) => void
  onBackToMenu?: () => void
}

export default function SystemSettings({ onAppLaunch, onBackToMenu }: SystemSettingsProps) {
  const [recordingEnabled, setRecordingEnabled] = useState(true)
  const [sentryMode, setSentryMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  const SettingItem = ({
    label,
    description,
    value,
    onChange,
  }: {
    label: string
    description: string
    value: boolean
    onChange: (val: boolean) => void
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-5 bg-white dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between cursor-pointer"
    >
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">
          {label}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </div>
      </div>

      {/* ✅ Redesigned Toggle Switch */}
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 flex items-center rounded-full transition-all border ${
          value
            ? "bg-green-500/20 border-green-500"
            : "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500"
        }`}
      >
        <motion.div
          animate={{ x: value ? 26 : 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`absolute w-4 h-4 rounded-full shadow ${
            value ? "bg-green-500" : "bg-gray-400 dark:bg-gray-500"
          }`}
        />
      </button>
    </motion.div>
  )

  return (
    <div className="w-full h-full px-8 py-10 bg-gray-50 dark:bg-[#0f0f0f] overflow-y-auto">
      
      {/* ✅ Header */}
      <div className="flex items-center gap-4 mb-10">
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="p-2 bg-white dark:bg-[#141414] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-100" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
      </div>

      {/* ✅ ACCOUNT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAppLaunch("account")}
        className="w-full p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl text-blue-600 dark:text-blue-300 font-bold"
      >
        👤 Go to Account Settings
      </motion.button>

      {/* ✅ PRIMARY SETTINGS */}
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-10 mb-3">
        Primary Settings
      </h2>

      <div className="space-y-4">
        <SettingItem
          label="Recording"
          description="Enable continuous recording when engine is running"
          value={recordingEnabled}
          onChange={setRecordingEnabled}
        />

        <SettingItem
          label="Sentry Mode"
          description="Monitor vehicle surroundings when parked"
          value={sentryMode}
          onChange={setSentryMode}
        />
      </div>

      {/* ✅ SECONDARY SETTINGS */}
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-10 mb-3">
        Secondary Options
      </h2>

      <div className="space-y-4">
        <SettingItem
          label="Debug Mode"
          description="Show ESP32 serial messages for troubleshooting"
          value={debugMode}
          onChange={setDebugMode}
        />
      </div>

      {/* ✅ SYSTEM INFO */}
      <div className="mt-14 bg-white dark:bg-[#141414] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          System Info
        </h3>

        <div className="space-y-3">
          {[
            { label: "Firmware Version", value: "2.1.0" },
            { label: "ESP32 Status", value: "Connected" },
            { label: "Serial Port", value: "COM3 @ 115200" },
            { label: "Storage", value: "256 GB SSD" },
          ].map((info, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-500 dark:text-gray-400">
                {info.label}
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {info.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ FOOTER BRANDING */}
      <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
        <p className="font-semibold text-blue-600 dark:text-blue-300">
          NAVI Infotainment System
        </p>
        <p>NaviCom • Est. 2025</p>
        <p className="mt-2 text-xs">v1.0.0</p>
      </div>
    </div>
  )
}
