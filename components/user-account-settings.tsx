"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Eye, EyeOff } from "lucide-react"
import type { UserSettings } from "@/types/user-settings"

interface UserAccountSettingsProps {
  onBack: () => void
}

export default function UserAccountSettings({ onBack }: UserAccountSettingsProps) {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      fullName: "Ivan Mercado",
      profilePicture: null,
      vehicleNickname: "Tesla Model 3",
      email: "ivan@navico.com",
      phoneNumber: "+1 (555) 000-0000",
    },
    security: {
      sentryVideoPIN: "1234",
      password: "••••••••",
      biometricEnabled: true,
    },
    themeDisplay: {
      theme: "dark",
      accentColor: "#ffffff",
      uiTheme: "automotive",
      fontSize: 16,
    },
    audio: {
      masterVolume: 75,
      equalizerPreset: "flat",
      navigationVoiceVolume: 80,
      soundEffectsEnabled: true,
    },
    connectivity: {
      wifiEnabled: true,
      bluetoothEnabled: true,
      hotspotEnabled: false,
      pairedDevices: ["iPhone 15", "AirPods Pro"],
    },
    navigation: {
      defaultMap: "google-maps",
      voiceGuidance: true,
      autoRetouting: true,
    },
    drivingMode: {
      autoNightMode: true,
      autoScreenBrightness: true,
      screenTimeout: 30,
      safetyFeaturesEnabled: true,
      cameraAutoRecord: true,
    },
    energy: {
      batteryPercentage: 85,
      estimatedRange: 245,
      chargingStatus: "idle",
    },
    developerOptions: {
      debugPanelEnabled: false,
      showFPS: false,
      serialConsoleEnabled: false,
      adminAccessEnabled: false,
    },
  })

  const [activeSection, setActiveSection] = useState<string>("profile")
  const [showPassword, setShowPassword] = useState(false)

  const SettingToggle = ({
    label,
    value,
    onChange,
  }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-accent/50 transition-smooth">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <motion.button
        onClick={() => onChange(!value)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-6 rounded-full border-2 flex items-center transition-smooth ${
          value ? "bg-accent/20 border-accent" : "bg-border/30 border-border"
        }`}
      >
        <motion.div
          animate={{ x: value ? 24 : 4 }}
          className={`w-4 h-4 rounded-full ${value ? "bg-accent" : "bg-muted-foreground"}`}
        />
      </motion.button>
    </div>
  )

  const SettingSlider = ({
    label,
    value,
    min,
    max,
    onChange,
  }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) => (
    <div className="p-3 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-accent">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
      />
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">USER PROFILE</h3>
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-3xl">
                  👤
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-smooth">
                  <Upload className="w-4 h-4" />
                  Change Picture
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                defaultValue={settings.profile.fullName}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground"
              />
              <input
                type="text"
                placeholder="Vehicle Nickname"
                defaultValue={settings.profile.vehicleNickname}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground"
              />
              <input
                type="email"
                placeholder="Email"
                defaultValue={settings.profile.email}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                defaultValue={settings.profile.phoneNumber}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground"
              />
            </div>
          </motion.div>
        )

      case "security":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">SECURITY & ACCESS</h3>
            <div className="space-y-3">
              <div className="p-3 bg-card rounded-lg border border-border">
                <label className="text-sm font-medium text-foreground mb-2 block">Sentry Video PIN</label>
                <div className="flex gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    defaultValue={settings.security.sentryVideoPIN}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 py-2 bg-card border border-border rounded-lg hover:bg-card/80 transition-smooth"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-smooth font-medium">
                Change Password
              </button>
              <SettingToggle
                label="Biometric Authentication"
                value={settings.security.biometricEnabled}
                onChange={(v) => setSettings({ ...settings, security: { ...settings.security, biometricEnabled: v } })}
              />
            </div>
          </motion.div>
        )

      case "theme":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">THEME & DISPLAY</h3>
            <div className="space-y-3">
              <div className="p-3 bg-card rounded-lg border border-border">
                <label className="text-sm font-medium text-foreground mb-2 block">Theme</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground">
                  <option>Dark</option>
                  <option>Light</option>
                </select>
              </div>
              <div className="p-3 bg-card rounded-lg border border-border">
                <label className="text-sm font-medium text-foreground mb-2 block">UI Theme</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground">
                  <option>Standard</option>
                  <option>Minimalist</option>
                  <option>Automotive</option>
                </select>
              </div>
              <SettingSlider
                label="Font Size"
                value={settings.themeDisplay.fontSize}
                min={12}
                max={24}
                onChange={(v) => setSettings({ ...settings, themeDisplay: { ...settings.themeDisplay, fontSize: v } })}
              />
            </div>
          </motion.div>
        )

      case "audio":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">AUDIO SETTINGS</h3>
            <div className="space-y-3">
              <SettingSlider
                label="Master Volume"
                value={settings.audio.masterVolume}
                min={0}
                max={100}
                onChange={(v) => setSettings({ ...settings, audio: { ...settings.audio, masterVolume: v } })}
              />
              <SettingSlider
                label="Navigation Voice Volume"
                value={settings.audio.navigationVoiceVolume}
                min={0}
                max={100}
                onChange={(v) => setSettings({ ...settings, audio: { ...settings.audio, navigationVoiceVolume: v } })}
              />
              <div className="p-3 bg-card rounded-lg border border-border">
                <label className="text-sm font-medium text-foreground mb-2 block">Equalizer Preset</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground">
                  <option>Flat</option>
                  <option>Bass</option>
                  <option>Treble</option>
                  <option>Vocal</option>
                  <option>Custom</option>
                </select>
              </div>
              <SettingToggle
                label="Sound Effects"
                value={settings.audio.soundEffectsEnabled}
                onChange={(v) => setSettings({ ...settings, audio: { ...settings.audio, soundEffectsEnabled: v } })}
              />
            </div>
          </motion.div>
        )

      case "connectivity":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">CONNECTIVITY</h3>
            <div className="space-y-3">
              <SettingToggle
                label="WiFi"
                value={settings.connectivity.wifiEnabled}
                onChange={(v) =>
                  setSettings({ ...settings, connectivity: { ...settings.connectivity, wifiEnabled: v } })
                }
              />
              <SettingToggle
                label="Bluetooth"
                value={settings.connectivity.bluetoothEnabled}
                onChange={(v) =>
                  setSettings({ ...settings, connectivity: { ...settings.connectivity, bluetoothEnabled: v } })
                }
              />
              <SettingToggle
                label="Hotspot"
                value={settings.connectivity.hotspotEnabled}
                onChange={(v) =>
                  setSettings({ ...settings, connectivity: { ...settings.connectivity, hotspotEnabled: v } })
                }
              />
              <div className="p-3 bg-card rounded-lg border border-border">
                <div className="text-sm font-medium text-foreground mb-2">Paired Devices</div>
                <div className="space-y-2">
                  {settings.connectivity.pairedDevices.map((device) => (
                    <div
                      key={device}
                      className="flex items-center justify-between px-2 py-1 bg-background rounded border border-border text-xs"
                    >
                      <span>{device}</span>
                      <button className="text-destructive hover:text-destructive/80">Remove</button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-2 px-3 py-2 text-sm bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-smooth">
                  Add New Device
                </button>
              </div>
            </div>
          </motion.div>
        )

      case "driving":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">DRIVING MODE</h3>
            <div className="space-y-3">
              <SettingToggle
                label="Auto Night Mode"
                value={settings.drivingMode.autoNightMode}
                onChange={(v) =>
                  setSettings({ ...settings, drivingMode: { ...settings.drivingMode, autoNightMode: v } })
                }
              />
              <SettingToggle
                label="Auto Screen Brightness"
                value={settings.drivingMode.autoScreenBrightness}
                onChange={(v) =>
                  setSettings({ ...settings, drivingMode: { ...settings.drivingMode, autoScreenBrightness: v } })
                }
              />
              <SettingSlider
                label="Screen Timeout (seconds)"
                value={settings.drivingMode.screenTimeout}
                min={10}
                max={300}
                onChange={(v) =>
                  setSettings({ ...settings, drivingMode: { ...settings.drivingMode, screenTimeout: v } })
                }
              />
              <SettingToggle
                label="Safety Features"
                value={settings.drivingMode.safetyFeaturesEnabled}
                onChange={(v) =>
                  setSettings({ ...settings, drivingMode: { ...settings.drivingMode, safetyFeaturesEnabled: v } })
                }
              />
              <SettingToggle
                label="Camera Auto-Record"
                value={settings.drivingMode.cameraAutoRecord}
                onChange={(v) =>
                  setSettings({ ...settings, drivingMode: { ...settings.drivingMode, cameraAutoRecord: v } })
                }
              />
            </div>
          </motion.div>
        )

      case "developer":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">DEVELOPER OPTIONS</h3>
            <div className="p-2 bg-destructive/10 border border-destructive/50 rounded-lg mb-4">
              <p className="text-xs text-destructive">
                These options are for advanced users only. Improper changes may affect system stability.
              </p>
            </div>
            <div className="space-y-3">
              <SettingToggle
                label="Debug Panel"
                value={settings.developerOptions.debugPanelEnabled}
                onChange={(v) =>
                  setSettings({ ...settings, developerOptions: { ...settings.developerOptions, debugPanelEnabled: v } })
                }
              />
              <SettingToggle
                label="Show FPS"
                value={settings.developerOptions.showFPS}
                onChange={(v) =>
                  setSettings({ ...settings, developerOptions: { ...settings.developerOptions, showFPS: v } })
                }
              />
              <SettingToggle
                label="Serial Console"
                value={settings.developerOptions.serialConsoleEnabled}
                onChange={(v) =>
                  setSettings({
                    ...settings,
                    developerOptions: { ...settings.developerOptions, serialConsoleEnabled: v },
                  })
                }
              />
              <SettingToggle
                label="Admin Access"
                value={settings.developerOptions.adminAccessEnabled}
                onChange={(v) =>
                  setSettings({
                    ...settings,
                    developerOptions: { ...settings.developerOptions, adminAccessEnabled: v },
                  })
                }
              />
              <button className="w-full px-4 py-2 bg-destructive/20 border border-destructive hover:bg-destructive/30 rounded-lg text-destructive font-medium transition-smooth">
                Reset App Cache
              </button>
              <button className="w-full px-4 py-2 bg-destructive/20 border border-destructive hover:bg-destructive/30 rounded-lg text-destructive font-medium transition-smooth">
                Reboot System
              </button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const sections = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "theme", label: "Theme", icon: "🎨" },
    { id: "audio", label: "Audio", icon: "🔊" },
    { id: "connectivity", label: "Connectivity", icon: "📡" },
    { id: "driving", label: "Driving", icon: "🚗" },
    { id: "developer", label: "Developer", icon: "⚙️" },
  ]

  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-secondary/5 p-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-card border border-border rounded-lg hover:border-accent/50 transition-smooth"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <h1 className="text-3xl font-bold text-foreground">ACCOUNT SETTINGS</h1>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-8">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg border transition-smooth flex flex-col items-center gap-1 ${
                activeSection === section.id
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card border-border hover:border-accent/50"
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              <span className="text-xs font-medium text-center leading-tight hidden sm:inline">{section.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card/50 border border-border rounded-lg p-6">{renderSection()}</div>
      </motion.div>
    </div>
  )
}
