export interface UserProfile {
  fullName: string
  profilePicture: string | null
  vehicleNickname: string
  email: string
  phoneNumber: string
}

export interface SecuritySettings {
  sentryVideoPIN: string
  password: string
  biometricEnabled: boolean
}

export interface ThemeDisplaySettings {
  theme: "light" | "dark"
  accentColor: string
  uiTheme: "standard" | "minimalist" | "automotive"
  fontSize: number // 12-24
}

export interface AudioSettings {
  masterVolume: number
  equalizerPreset: "flat" | "bass" | "treble" | "vocal" | "custom"
  navigationVoiceVolume: number
  soundEffectsEnabled: boolean
}

export interface ConnectivitySettings {
  wifiEnabled: boolean
  bluetoothEnabled: boolean
  hotspotEnabled: boolean
  pairedDevices: string[]
}

export interface NavigationSettings {
  defaultMap: "google-maps" | "waze"
  voiceGuidance: boolean
  autoRetouting: boolean
}

export interface DrivingModeSettings {
  autoNightMode: boolean
  autoScreenBrightness: boolean
  screenTimeout: number // seconds
  safetyFeaturesEnabled: boolean
  cameraAutoRecord: boolean
}

export interface EnergySettings {
  batteryPercentage: number
  estimatedRange: number // km
  chargingStatus: "idle" | "charging" | "discharging"
}

export interface DeveloperOptions {
  debugPanelEnabled: boolean
  showFPS: boolean
  serialConsoleEnabled: boolean
  adminAccessEnabled: boolean
}

export interface UserSettings {
  profile: UserProfile
  security: SecuritySettings
  themeDisplay: ThemeDisplaySettings
  audio: AudioSettings
  connectivity: ConnectivitySettings
  navigation: NavigationSettings
  drivingMode: DrivingModeSettings
  energy: EnergySettings
  developerOptions: DeveloperOptions
}
