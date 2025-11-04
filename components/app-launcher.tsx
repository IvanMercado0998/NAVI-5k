"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

interface AppLauncherProps {
  app: string
  onClose: () => void
}

export default function AppLauncher({ app, onClose }: AppLauncherProps) {
  const apps = {
    youtube: {
      title: "YouTube",
      color: "from-red-600 to-red-700",
      icon: "▶",
      content: (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="text-6xl mb-4">▶</div>
            <p className="text-xl text-gray-400">YouTube Video Player</p>
            <p className="text-sm text-gray-600 mt-2">Connected via vehicle system</p>
            <div className="mt-8 w-full aspect-video bg-gray-900 rounded-lg border-2 border-gray-700" />
          </div>
        </div>
      ),
    },
    chrome: {
      title: "Chrome",
      color: "from-yellow-500 to-red-500",
      icon: "◉",
      content: (
        <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
            <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 text-sm">https://example.com</div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">◉</div>
              <p className="text-lg">Chrome Browser</p>
              <p className="text-sm mt-2">Navigation & Web Browsing</p>
            </div>
          </div>
        </div>
      ),
    },
    maps: {
      title: "Google Maps",
      color: "from-green-500 to-blue-500",
      icon: "🗺",
      content: (
        <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600"
            />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺</div>
              <p className="text-lg">Google Maps Navigation</p>
              <p className="text-sm text-gray-500 mt-2">Real-time Navigation & Routing</p>
            </div>
          </div>
        </div>
      ),
    },
    camera: {
      title: "Camera",
      color: "from-blue-500 to-purple-500",
      icon: "📷",
      content: (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <div className="text-6xl mb-4 animate-pulse">📷</div>
                <p className="text-lg text-gray-300">Camera View</p>
                <p className="text-sm text-gray-600 mt-2">Multi-camera System Active</p>
              </div>
              <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
                {["Front", "Rear", "Left", "Right"].map((cam, i) => (
                  <div
                    key={cam}
                    className="bg-gray-900 rounded-lg border-2 border-gray-700 flex items-center justify-center text-gray-600"
                  >
                    {cam}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  }

  const selectedApp = apps[app as keyof typeof apps]

  if (!selectedApp) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedApp.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{selectedApp.icon}</span>
          <h1 className="text-2xl font-bold text-white">{selectedApp.title}</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-auto"
      >
        {selectedApp.content}
      </motion.div>
    </motion.div>
  )
}
