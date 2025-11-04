"use client"

import type React from "react"
import Navigation from "./navigation"

interface DashboardLayoutProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onAppLaunch: (app: string) => void
  children: React.ReactNode
}

export default function DashboardLayout({ activeTab, setActiveTab, onAppLaunch, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-background transition-smooth">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-secondary/5 transition-smooth">
        {children}
      </div>
    </div>
  )
}
