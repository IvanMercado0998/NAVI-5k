"use client"

import { motion } from "framer-motion"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Camera", icon: "📷", description: "Multi-view Camera System" },
    { id: "controls", label: "Controls", icon: "⚙️", description: "Vehicle Controls" },
    { id: "settings", label: "Settings", icon: "⚡", description: "System Settings" },
  ]

  return (
    <nav className="w-24 bg-card border-r border-border flex flex-col items-center py-6 gap-3">
      {navItems.map((item, idx) => (
        <motion.button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-smooth ${
            activeTab === item.id
              ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
              : "border-border hover:border-accent/50 hover:bg-secondary/30"
          }`}
          title={item.description}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs font-bold text-center uppercase">{item.label.split(" ")[0]}</span>
        </motion.button>
      ))}
    </nav>
  )
}
