"use client"

import { useState } from "react"
import SplashScreen from "@/components/splash-screen"
import AppMenu from "@/components/app-menu"
import DashboardLayout from "@/components/dashboard-layout"
import StatusBar from "@/components/status-bar"
import CameraView from "@/components/camera-view"
import ControlPanel from "@/components/control-panel"
import SystemSettings from "@/components/system-settings"
import SentryMode from "@/components/sentry-mode"
import UserAccountSettings from "@/components/user-account-settings"
import AppViewer from "@/components/app-viewer"
import { useVehicleState } from "@/hooks/use-vehicle-state"

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false)
  const [showAppMenu, setShowAppMenu] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [splitScreenMode, setSplitScreenMode] = useState(false)
  const vehicleState = useVehicleState()

  const handleAppSelect = (app: string) => {
    if (app === "controls") {
      setShowAppMenu(false)
      setActiveTab("controls")
      setActiveApp(null)
      setSplitScreenMode(false)
    } else if (app === "settings") {
      setShowAppMenu(false)
      setActiveTab("settings")
      setActiveApp(null)
      setSplitScreenMode(false)
    } else if (["maps", "youtube", "youtube-music", "spotify", "chrome"].includes(app)) {
      setShowAppMenu(false)
      setActiveApp(app)
      setSplitScreenMode(true)
      setActiveTab("home")
    } else {
      setShowAppMenu(false)
      setActiveApp(app)
      setSplitScreenMode(false)
    }
  }

  const handleBackToMenu = () => {
    setShowAppMenu(true)
    setActiveApp(null)
    setSplitScreenMode(false)
    setActiveTab("home")
  }

  if (!bootComplete) {
    return <SplashScreen onComplete={() => setBootComplete(true)} />
  }

  if (showAppMenu && !activeApp && activeTab === "home") {
    return <AppMenu onAppSelect={handleAppSelect} />
  }

  if (vehicleState.sentryMode) {
    return <SentryMode vehicleState={vehicleState} onDisable={() => vehicleState.setAlarmTrip(false)} />
  }

  // Split-screen mode for apps
  if (splitScreenMode && activeApp) {
    return (
      <main className="w-full h-screen bg-background overflow-hidden flex">
        {/* Left side - Dashboard */}
        <div className="flex-1 flex flex-col border-r border-border">
          <StatusBar vehicleState={vehicleState} onAppLaunch={handleAppSelect} onBackToMenu={handleBackToMenu} />
          <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onAppLaunch={handleAppSelect}>
            {activeTab === "home" && <CameraView vehicleState={vehicleState} />}
            {activeTab === "controls" && <ControlPanel vehicleState={vehicleState} />}
            {activeTab === "settings" && (
              <SystemSettings onAppLaunch={handleAppSelect} onBackToMenu={handleBackToMenu} />
            )}
          </DashboardLayout>
        </div>

        {/* Right side - App */}
        <div className="flex-1 flex flex-col bg-card">
          <AppViewer
            app={activeApp}
            onClose={() => {
              setActiveApp(null)
              setSplitScreenMode(false)
            }}
            onBack={handleBackToMenu}
          />
        </div>
      </main>
    )
  }

  // Account Settings
  if (activeTab === "account") {
    return (
      <main className="w-full h-screen bg-background overflow-hidden">
        <StatusBar vehicleState={vehicleState} onAppLaunch={handleAppSelect} onBackToMenu={handleBackToMenu} />
        <UserAccountSettings
          onBack={() => {
            setActiveTab("settings")
            setSplitScreenMode(false)
          }}
        />
      </main>
    )
  }

  return (
    <main className="w-full h-screen bg-background overflow-hidden">
      <StatusBar vehicleState={vehicleState} onAppLaunch={handleAppSelect} onBackToMenu={handleBackToMenu} />
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onAppLaunch={handleAppSelect}>
        {activeTab === "home" && <CameraView vehicleState={vehicleState} />}
        {activeTab === "controls" && <ControlPanel vehicleState={vehicleState} />}
        {activeTab === "settings" && <SystemSettings onAppLaunch={handleAppSelect} onBackToMenu={handleBackToMenu} />}
      </DashboardLayout>
    </main>
  )
}
