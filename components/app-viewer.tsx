"use client"

import { motion } from "framer-motion"
import { X, ArrowLeft } from "lucide-react"

interface AppViewerProps {
  app: string
  onClose: () => void
  onBack: () => void
}

export default function AppViewer({ app, onClose, onBack }: AppViewerProps) {
  const apps = {
    youtube: {
      title: "YouTube",
      color: "from-red-600 to-red-700",
      icon: "▶",
      content: (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center gap-3">
            <input
              type="text"
              placeholder="Search videos..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500"
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center border border-gray-700 cursor-pointer hover:border-red-500 transition-colors"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">▶</div>
                  <p className="text-xs text-gray-400">Video {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    "youtube-music": {
      title: "YouTube Music",
      color: "from-red-500 to-pink-500",
      icon: "♫",
      content: (
        <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
          <div className="p-6 border-b border-gray-700 flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">♫</div>
            <div>
              <h3 className="text-white font-bold">Now Playing</h3>
              <p className="text-gray-400 text-sm">Song Name - Artist</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {["Track 1", "Track 2", "Track 3", "Track 4", "Track 5"].map((track) => (
              <div
                key={track}
                className="p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-pink-500 transition-colors cursor-pointer"
              >
                <p className="text-white font-medium">{track}</p>
                <p className="text-xs text-gray-400">Artist Name</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    spotify: {
      title: "Spotify",
      color: "from-green-500 to-green-600",
      icon: "🎵",
      content: (
        <div className="w-full h-full flex flex-col bg-gradient-to-b from-green-900 to-black">
          <div className="p-6 border-b border-green-700 flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">🎵</div>
            <div>
              <h3 className="text-white font-bold">Now Playing</h3>
              <p className="text-gray-400 text-sm">Song - Artist</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {["Playlist 1", "Playlist 2", "Liked Songs", "Recently Played"].map((item) => (
              <div
                key={item}
                className="p-3 bg-gray-900 rounded-lg border border-green-700 hover:border-green-400 transition-colors cursor-pointer"
              >
                <p className="text-white font-medium">{item}</p>
                <p className="text-xs text-gray-400">Tap to play</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    chrome: {
      title: "Google Chrome",
      color: "from-yellow-500 to-red-500",
      icon: "◉",
      content: (
        <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 space-x-2">
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">←</button>
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">→</button>
            <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              https://example.com
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-4">◉</div>
              <p className="font-medium">Browser Ready</p>
              <p className="text-sm mt-1">Navigate web pages</p>
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
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700 space-y-2">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-foreground placeholder-gray-500"
            />
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm">Navigate</button>
              <button className="flex-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Nearby</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-800 dark:to-gray-700">
            <div className="text-center">
              <div className="text-5xl mb-4">🗺</div>
              <p className="font-bold">Navigation Ready</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enter destination</p>
            </div>
          </div>
        </div>
      ),
    },
  }

  const selectedApp = apps[app as keyof typeof apps]

  if (!selectedApp) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedApp.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedApp.icon}</span>
          <h1 className="text-xl font-bold text-white">{selectedApp.title}</h1>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
        </div>
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
