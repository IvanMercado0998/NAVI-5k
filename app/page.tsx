// app/page.tsx - virtual keyboard fix - dont change logic 
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
import AppViewer from "@/components/app-viewer/AppViewer"
import { useVehicleState } from "@/hooks/use-vehicle-state"
import KeyboardWrapper from "@/components/keyboard-wrapper" // Add this import

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false)
  const [showAppMenu, setShowAppMenu] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [splitScreenMode, setSplitScreenMode] = useState(false)
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false)
  const vehicleState = useVehicleState()

  const handleAppSelect = (app: string) => {
    console.log("App selected:", app)
    
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
      setAccountSettingsOpen(false)
    } else if (app === "account") {
      setAccountSettingsOpen(true)
      setShowAppMenu(false)
      setActiveApp(null)
      setSplitScreenMode(false)
    } else if (["maps", "youtube", "youtube-music", "spotify", "brave"].includes(app)) {
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
    setAccountSettingsOpen(false)
  }

  // Handle app launch from Navigation component
  const handleAppLaunch = (appId: string) => {
    console.log("App launched from navigation:", appId)
    handleAppSelect(appId)
  }

  if (!bootComplete) {
    return <SplashScreen onComplete={() => setBootComplete(true)} />
  }

  // Account Settings screen
  if (accountSettingsOpen) {
    return (
      <KeyboardWrapper> {/* Wrap Account Settings */}
        <main className="w-full h-screen bg-background overflow-hidden">
          <StatusBar
            vehicleState={vehicleState}
            onBackToMenu={handleBackToMenu}
          />
          <UserAccountSettings onBack={handleBackToMenu} />
        </main>
      </KeyboardWrapper>
    )
  }

  if (showAppMenu && !activeApp && activeTab === "home") {
    return (
      <KeyboardWrapper> {/* Wrap App Menu */}
        <AppMenu onAppSelect={handleAppSelect} />
      </KeyboardWrapper>
    )
  }

  if (vehicleState.sentryMode) {
    return (
      <KeyboardWrapper> {/* Wrap Sentry Mode */}
        <SentryMode
          vehicleState={vehicleState}
          onDisable={() => vehicleState.setAlarmTrip(false)}
        />
      </KeyboardWrapper>
    )
  }

  // Split-screen mode for apps
  if (splitScreenMode && activeApp) {
    return (
      <KeyboardWrapper> {/* Wrap Split Screen */}
        <main className="w-full h-screen bg-background overflow-hidden flex">
          {/* Left side - Dashboard */}
          <div className="flex-1 flex flex-col border-r border-border">
            <StatusBar
              vehicleState={vehicleState}
              onBackToMenu={handleBackToMenu}
            />
            <DashboardLayout
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeApp={activeApp}
              setActiveApp={setActiveApp}
              onAppLaunch={handleAppLaunch}
            >
              {activeTab === "home" && <CameraView vehicleState={vehicleState} />}
              {activeTab === "controls" && <ControlPanel vehicleState={vehicleState} />}
              {activeTab === "settings" && (
                <SystemSettings
                  onAppLaunch={handleAppSelect}
                  onBackToMenu={handleBackToMenu}
                />
              )}
            </DashboardLayout>
          </div>

          {/* Right side - App */}
          <div className="flex-1 flex flex-col bg-card">
            <AppViewer
              app={activeApp as any}
              onClose={() => {
                setActiveApp(null)
                setSplitScreenMode(false)
              }}
              onBack={handleBackToMenu}
            />
          </div>
        </main>
      </KeyboardWrapper>
    )
  }

  // Default dashboard
  return (
    <KeyboardWrapper> {/* Wrap Default Dashboard */}
      <main className="w-full h-screen bg-background overflow-hidden">
        <StatusBar
          vehicleState={vehicleState}
          onBackToMenu={handleBackToMenu}
        />
        <DashboardLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeApp={activeApp}
          setActiveApp={setActiveApp}
          onAppLaunch={handleAppLaunch}
        >
          {activeTab === "home" && <CameraView vehicleState={vehicleState} />}
          {activeTab === "controls" && <ControlPanel vehicleState={vehicleState} />}
          {activeTab === "settings" && (
            <SystemSettings
              onAppLaunch={handleAppSelect}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </DashboardLayout>
      </main>
    </KeyboardWrapper>
  )
}