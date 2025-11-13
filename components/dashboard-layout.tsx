// components/dashboard-layout.tsx
"use client"

import type React from "react"
import Navigation from "./navigation"

interface DashboardLayoutProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onAppLaunch: (app: string) => void
  children: React.ReactNode
  activeApp?: string | null
  setActiveApp?: (app: string | null) => void
}

export default function DashboardLayout({ 
  activeTab, 
  setActiveTab, 
  onAppLaunch, 
  children,
  activeApp,
  setActiveApp 
}: DashboardLayoutProps) {
  
  // Handle app launch from navigation
  const handleAppLaunch = (appId: string) => {
    console.log("DashboardLayout: App launched", appId)
    onAppLaunch(appId)
  }

  // Handle active app change from navigation with fallback
  const handleActiveAppChange = (appId: string) => {
    console.log("DashboardLayout: Active app changed", appId)
    if (setActiveApp && typeof setActiveApp === 'function') {
      setActiveApp(appId)
    } else {
      console.warn('setActiveApp is not available, using onAppLaunch instead')
      onAppLaunch(appId)
    }
  }

  // Determine active app with fallback
  const currentActiveApp = activeApp || "home"

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-background transition-smooth">
      {/* Navigation with app props */}
      <Navigation 
        activeApp={currentActiveApp}
        setActiveApp={handleActiveAppChange}
        onAppLaunch={handleAppLaunch}
      />
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-secondary/5 transition-smooth">
        {children}
      </div>
    </div>
  )
}