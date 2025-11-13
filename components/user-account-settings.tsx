"use client";

/*
SystemSettings.tsx — Tesla-style themed settings page

Flat background (dark: gray-950 -> grey; light: gray-100 -> light grey)

Gradient accents for active elements

Syncs theme via next-themes useTheme and HeaderBar event 'navi:theme:change'

Keeps same functionality/components (TeslaToggle, TeslaSlider, TeslaInput)
*/

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Eye,
  EyeOff,
  Wifi,
  Bluetooth,
  Radio,
  Palette,
  Shield,
  User,
  Car,
  Code,
} from "lucide-react";

import { useTheme } from "next-themes";
import type { UserSettings } from "@/types/user-settings";

interface SystemSettingsProps {
  onBack: () => void;
}

export default function SystemSettings({ onBack }: SystemSettingsProps) {
  const { theme, setTheme } = useTheme();

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
      password: "password123",
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
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  // Sync theme events (HeaderBar emits navi:theme:change)
  useEffect(() => {
    const handleThemeEvent = (e: any) => {
      if (e?.detail?.theme) setTheme(e.detail.theme);
    };
    window.addEventListener("navi:theme:change", handleThemeEvent);
    return () => window.removeEventListener("navi:theme:change", handleThemeEvent);
  }, [setTheme]);

  // Small helpers for styling
  const isDark = theme === "dark";

  // Tesla-style Toggle
  const TeslaToggle = ({ label, value, onChange, description }: any) => (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${isDark ? "bg-gray-850/40 border-gray-700" : "bg-gray-100 border-gray-200"}`}
      aria-pressed={value}
      role="switch"
    >
      <div className="flex-1">
        <span className={`${isDark ? "text-white" : "text-gray-900"} font-medium`}>{label}</span>
        {description && (
          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{description}</p>
        )}
      </div>

      <motion.button
        type="button"
        onClick={() => onChange(!value)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value
            ? "bg-gradient-to-br from-gray-700 to-gray-900"
            : isDark
            ? "bg-gray-600"
            : "bg-gray-300"
        }`}
        aria-label={`${label} toggle`}
      >
        <motion.div
          animate={{ x: value ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </motion.button>
    </div>
  );

  // Tesla-style Slider
  const TeslaSlider = ({ label, value, min, max, onChange, unit = "" }: any) => (
    <div className={`p-4 rounded-xl border backdrop-blur-sm ${isDark ? "bg-gray-850/30 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${isDark ? "text-white" : "text-gray-900"} font-medium`}>{label}</span>
        <span className="text-blue-400 font-semibold">{value}{unit}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        aria-label={label}
      />

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ffffff, #d1d5db);
          border: 2px solid rgba(0,0,0,0.08);
          box-shadow: 0 6px 18px rgba(0,0,0,0.18);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ffffff, #d1d5db);
          border: 2px solid rgba(0,0,0,0.08);
          cursor: pointer;
        }
      `}</style>
    </div>
  );

  // Tesla-style Input
  const TeslaInput = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="space-y-2">
      <label className={`${isDark ? "text-gray-200" : "text-gray-700"} text-sm font-medium`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all ${ isDark ? "bg-gray-800/50 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200" }`}
      />
    </div>
  );

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "theme", label: "Display", icon: Palette },
    { id: "audio", label: "Audio", icon: Radio },
    { id: "connectivity", label: "Connectivity", icon: Wifi },
    { id: "driving", label: "Driving", icon: Car },
    { id: "developer", label: "Developer", icon: Code },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`flex items-center gap-6 p-6 rounded-2xl border ${isDark ? "bg-gray-900/30 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                  {settings.profile.profilePicture ? (
                    <img src={settings.profile.profilePicture} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    "IM"
                  )}
                </div>

                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, profilePicture: URL.createObjectURL(e.target.files[0]) },
                      });
                    }
                  }}
                />

                <label htmlFor="upload" className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-full cursor-pointer shadow">
                  <Upload className="w-4 h-4" />
                </label>
              </div>

              <div>
                <h3 className={`${isDark ? "text-white" : "text-gray-900"} text-xl font-bold`}>{settings.profile.fullName}</h3>
                <p className="text-sm text-gray-400">{settings.profile.vehicleNickname}</p>
                <p className="text-sm text-gray-400">{settings.profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <TeslaInput
                label="Full Name"
                value={settings.profile.fullName}
                onChange={(v: string) => setSettings({ ...settings, profile: { ...settings.profile, fullName: v } })}
              />
              <TeslaInput
                label="Vehicle Nickname"
                value={settings.profile.vehicleNickname}
                onChange={(v: string) => setSettings({ ...settings, profile: { ...settings.profile, vehicleNickname: v } })}
              />
              <TeslaInput
                label="Email"
                value={settings.profile.email}
                type="email"
                onChange={(v: string) => setSettings({ ...settings, profile: { ...settings.profile, email: v } })}
              />
              <TeslaInput
                label="Phone Number"
                value={settings.profile.phoneNumber}
                type="tel"
                onChange={(v: string) => setSettings({ ...settings, profile: { ...settings.profile, phoneNumber: v } })}
              />
            </div>
          </motion.div>
        );

      case "security":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <label className={`${isDark ? "text-white" : "text-gray-800"} mb-2 block`}>Sentry Video PIN</label>
              <div className="flex gap-3">
                <input
                  type={showPassword ? "text" : "password"}
                  value={settings.security.sentryVideoPIN}
                  onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sentryVideoPIN: e.target.value } })}
                  className={`flex-1 px-4 py-3 rounded-xl border ${isDark ? "bg-gray-800/50 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`px-4 py-3 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-700"}`}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <TeslaToggle label="Biometric Authentication" value={settings.security.biometricEnabled} onChange={(v: boolean) => setSettings({ ...settings, security: { ...settings.security, biometricEnabled: v } })} description="Use fingerprint or face ID for quick access" />
            </div>
          </motion.div>
        );

      case "theme":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TeslaToggle label="Dark Mode" value={isDark} onChange={(v: boolean) => setTheme(v ? "dark" : "light")} description="Toggle application theme" />
            <div className="mt-4">
              <TeslaSlider label="Font Size" value={settings.themeDisplay.fontSize} min={12} max={24} onChange={(v: number) => setSettings({ ...settings, themeDisplay: { ...settings.themeDisplay, fontSize: v } })} unit="px" />
            </div>
          </motion.div>
        );

      case "audio":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TeslaSlider label="Master Volume" value={settings.audio.masterVolume} min={0} max={100} onChange={(v: number) => setSettings({ ...settings, audio: { ...settings.audio, masterVolume: v } })} unit="%" />
            <div className="mt-4">
              <TeslaSlider label="Navigation Volume" value={settings.audio.navigationVoiceVolume} min={0} max={100} onChange={(v: number) => setSettings({ ...settings, audio: { ...settings.audio, navigationVoiceVolume: v } })} unit="%" />
            </div>
            <div className="mt-4">
              <TeslaToggle label="Sound Effects" value={settings.audio.soundEffectsEnabled} onChange={(v: boolean) => setSettings({ ...settings, audio: { ...settings.audio, soundEffectsEnabled: v } })} />
            </div>
          </motion.div>
        );

      case "connectivity":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TeslaToggle label="Wi-Fi" value={settings.connectivity.wifiEnabled} onChange={(v: boolean) => setSettings({ ...settings, connectivity: { ...settings.connectivity, wifiEnabled: v } })} />
            <div className="mt-3">
              <TeslaToggle label="Bluetooth" value={settings.connectivity.bluetoothEnabled} onChange={(v: boolean) => setSettings({ ...settings, connectivity: { ...settings.connectivity, bluetoothEnabled: v } })} />
            </div>
            <div className="mt-3">
              <TeslaToggle label="Hotspot" value={settings.connectivity.hotspotEnabled} onChange={(v: boolean) => setSettings({ ...settings, connectivity: { ...settings.connectivity, hotspotEnabled: v } })} />
            </div>
          </motion.div>
        );

      case "driving":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TeslaToggle label="Auto Night Mode" value={settings.drivingMode.autoNightMode} onChange={(v: boolean) => setSettings({ ...settings, drivingMode: { ...settings.drivingMode, autoNightMode: v } })} />
            <div className="mt-3">
              <TeslaToggle label="Safety Features" value={settings.drivingMode.safetyFeaturesEnabled} onChange={(v: boolean) => setSettings({ ...settings, drivingMode: { ...settings.drivingMode, safetyFeaturesEnabled: v } })} />
            </div>
            <div className="mt-3">
              <TeslaToggle label="Camera Auto Record" value={settings.drivingMode.cameraAutoRecord} onChange={(v: boolean) => setSettings({ ...settings, drivingMode: { ...settings.drivingMode, cameraAutoRecord: v } })} />
            </div>
          </motion.div>
        );

      case "developer":
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TeslaToggle label="Debug Panel" value={settings.developerOptions.debugPanelEnabled} onChange={(v: boolean) => setSettings({ ...settings, developerOptions: { ...settings.developerOptions, debugPanelEnabled: v } })} />
            <div className="mt-3">
              <TeslaToggle label="Show FPS" value={settings.developerOptions.showFPS} onChange={(v: boolean) => setSettings({ ...settings, developerOptions: { ...settings.developerOptions, showFPS: v } })} />
            </div>
            <div className="mt-3">
              <TeslaToggle label="Serial Console" value={settings.developerOptions.serialConsoleEnabled} onChange={(v: boolean) => setSettings({ ...settings, developerOptions: { ...settings.developerOptions, serialConsoleEnabled: v } })} />
            </div>
            <div className="mt-3">
              <TeslaToggle label="Admin Access" value={settings.developerOptions.adminAccessEnabled} onChange={(v: boolean) => setSettings({ ...settings, developerOptions: { ...settings.developerOptions, adminAccessEnabled: v } })} />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full p-6 ${isDark ? "bg-gray-950" : "bg-gray-100"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`p-3 rounded-xl border backdrop-blur-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div>
            <h1 className={`${isDark ? "text-white" : "text-gray-900"} text-3xl font-bold`}>Settings</h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>Manage your system preferences</p>
          </div>
        </motion.div>

        {/* Body */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-64 flex-shrink-0">
            <div className={`rounded-2xl border p-4 ${isDark ? "bg-gray-900/30 border-gray-700" : "bg-white border-gray-200"}`}>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow" : (isDark ? "text-gray-300 hover:bg-gray-800/50" : "text-gray-700 hover:bg-gray-50")}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main */}
          <motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900/30 border-gray-700" : "bg-white border-gray-200"}`}>
              <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};