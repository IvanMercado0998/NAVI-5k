"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import StatusBar from "@/components/status-bar"
import CameraView from "@/components/camera-view"
import ControlPanel from "@/components/control-panel"
import SystemSettings from "@/components/system-settings"
import AppLauncher from "@/components/app-launcher"
import { useVehicleState } from "@/hooks/use-vehicle-state"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const vehicleState = useVehicleState()

  if (activeApp) {
    return <AppLauncher app={activeApp} onClose={() => setActiveApp(null)} />
  }

  return (
    <main className="w-full h-screen bg-background overflow-hidden">
      <StatusBar vehicleState={vehicleState} onAppLaunch={setActiveApp} />
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onAppLaunch={setActiveApp}>
        {activeTab === "home" && <CameraView vehicleState={vehicleState} />}
        {activeTab === "controls" && <ControlPanel vehicleState={vehicleState} />}
        {activeTab === "settings" && <SystemSettings onAppLaunch={setActiveApp} />}
      </DashboardLayout>
    </main>
  )
}
