"use client"

import { Globe, Play, Chrome, Camera, Settings } from "lucide-react"

interface AppMenuProps {
  onAppSelect: (app: string) => void
}

export default function AppMenu({ onAppSelect }: AppMenuProps) {
  const apps = [
    {
      id: "maps",
      name: "Maps",
      icon: Globe,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Play,
      color: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-300",
    },
    {
      id: "chrome",
      name: "Chrome",
      icon: Chrome,
      color: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600 dark:text-yellow-300",
    },
    {
      id: "camera",
      name: "Camera",
      icon: Camera,
      color: "bg-gray-200 dark:bg-gray-800",
      iconColor: "text-gray-700 dark:text-gray-300",
    },
    {
      id: "controls",
      name: "Controls",
      icon: Settings,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
  ]

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-foreground">NAVI</h2>
        <p className="text-sm text-muted-foreground mt-2">NaviCo Infotainment System</p>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
        {apps.map((app) => {
          const Icon = app.icon
          return (
            <button
              key={app.id}
              onClick={() => onAppSelect(app.id)}
              className={`flex flex-col items-center justify-center w-24 h-24 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-foreground/10 ${app.color}`}
            >
              <Icon className={`w-10 h-10 mb-2 ${app.iconColor}`} />
              <span className="text-xs font-bold text-foreground text-center">{app.name}</span>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-xs text-muted-foreground">
        <p>Est. 2025 | Founded by Ivan Mercado</p>
      </div>
    </div>
  )
}
