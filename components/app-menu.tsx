"use client"

import { Map, Youtube, Chrome, Camera, Sliders, Settings } from "lucide-react"
import { motion } from "framer-motion"

interface AppMenuProps {
  onAppSelect: (app: string) => void
}

export default function AppMenu({ onAppSelect }: AppMenuProps) {
  const apps = [
    {
      id: "maps",
      name: "Maps",
      icon: Map,
      color: "bg-green-500 dark:bg-green-600",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "bg-red-500 dark:bg-red-600",
    },
    {
      id: "youtube-music",
      name: "YT Music",
      icon: () => <span className="text-2xl">♫</span>,
      color: "bg-red-600 dark:bg-red-700",
    },
    {
      id: "spotify",
      name: "Spotify",
      icon: () => <span className="text-2xl">🎵</span>,
      color: "bg-green-600 dark:bg-green-700",
    },
    {
      id: "chrome",
      name: "Chrome",
      icon: Chrome,
      color: "bg-yellow-500 dark:bg-yellow-600",
    },
    {
      id: "camera",
      name: "Camera",
      icon: Camera,
      color: "bg-gray-500 dark:bg-gray-600",
    },
    {
      id: "controls",
      name: "Controls",
      icon: Sliders,
      color: "bg-purple-500 dark:bg-purple-600",
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      color: "bg-emerald-500 dark:bg-emerald-600",
    },
  ]

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Header - responsive sizing */}
      <div className="mb-8 sm:mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">NAVI</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">NaviCo Infotainment System</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl px-4">
        {apps.map((app) => {
          const Icon = app.icon
          return (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAppSelect(app.id)}
              className={`
                flex flex-col items-center justify-center
                w-full aspect-square
                rounded-2xl sm:rounded-3xl
                transition-all duration-200
                shadow-lg hover:shadow-xl
                ${app.color}
                text-white font-bold
                min-h-24 sm:min-h-32 md:min-h-40
              `}
            >
              {typeof Icon === "function" ? (
                <Icon />
              ) : (
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3" />
              )}
              <span className="text-xs sm:text-sm md:text-base text-center leading-tight">{app.name}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Footer - responsive */}
      <div className="absolute bottom-4 sm:bottom-8 text-center text-xs text-muted-foreground px-4">
        <p>Est. 2025 | Founded by Ivan Mercado</p>
      </div>
    </div>
  )
}
