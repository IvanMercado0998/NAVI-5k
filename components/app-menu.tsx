//components\app-menu.tsx
// implement slow zoom of background image 
// implement this for background images and add a overlay blur effect on top of this images 
//DIR: public\background-images\darkmode-bg.jpg (Dark Mode Background Image)
//     public\background-images\lightmode-bg.jpg (Light Mode Background Image)

/**
 * NAVI Infotainment System - Application Launcher Menu
 * 
 * @component
 * @description
 * Primary application launcher interface for the NAVI automotive infotainment system.
 * Features a visually immersive grid of applications with animated interactions,
 * audio feedback, and professional automotive-grade user experience design.
 * 
 * @version 1.0.0
 * @author Ivan Mercado
 * @created 2025
 * 
 * @features
 * - 8-application grid with gradient backgrounds and glow effects
 * - Animated hover and tap interactions using Framer Motion
 * - Integrated audio feedback on app selection
 * - Fallback icon system for missing application logos
 * - CarPlay-inspired status bar with connectivity indicators
 * - Responsive grid layout with professional visual hierarchy
 * - Particle animation background for enhanced depth
 * 
 * @props {function} onAppSelect - Callback function executed when user selects an application
 * 
 * @audio
 * - Path: /sounds/tap-sound.mp3
 * - Format: MP3
 * - Timing: Plays on application selection
 * - Purpose: Provides tactile audio feedback for user interactions
 * 
 * @applications
 * - Maps: Navigation and location services
 * - YouTube: Video streaming platform
 * - YT Music: Music streaming service
 * - Spotify: Premium music streaming
 * - Brave: Privacy-focused web browser
 * - Camera: Media capture functionality
 * - Controls: System control interface
 * - Settings: System configuration panel
 * 
 * @animations
 * - Staggered app icon entrance animations
 * - Spring-based hover effects with scale and lift
 * - Particle background system
 * - Smooth opacity transitions
 * 
 * @design
 * - Gradient backgrounds with brand-appropriate colors
 * - Glassmorphism effects with backdrop blur
 * - Professional spacing and typography
 * - Mobile-first responsive design
 * - Accessibility-compliant contrast ratios
 */

"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

interface AppMenuProps {
  onAppSelect: (app: string) => void
}

interface AppData {
  id: string
  name: string
  color: string
  glow: string
  logoPath: string
}

export default function AppMenu({ onAppSelect }: AppMenuProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Theme updates from HeaderBar via custom event
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
      }
    };

    // Add event listener for custom theme change events
    window.addEventListener("navi:theme:change", handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener("navi:theme:change", handleThemeChange as EventListener);
    };
  }, [setTheme]);

  // Audio handler for app selection feedback
  const playTapSound = () => {
    const audio = new Audio('/sounds/tap-sound.mp3')
    audio.volume = 0.9 // Reduced volume for subtle feedback
    audio.play().catch(error => {
      console.log('Tap sound play failed:', error)
    })
  }

  const handleAppSelect = (appId: string) => {
    playTapSound()
    onAppSelect(appId)
  }

  const apps: AppData[] = [
    {
      id: "maps",
      name: "Maps",
      color: "from-green-500 to-green-600",
      glow: "hover:shadow-green-500/30",
      logoPath: "/logos/googlemaps.png"
    },
    {
      id: "youtube",
      name: "YouTube",
      color: "from-red-500 to-red-600",
      glow: "hover:shadow-red-500/30",
      logoPath: "/logos/youtube.png"
    },
    {
      id: "youtube-music",
      name: "YT Music",
      color: "from-red-600 to-red-700",
      glow: "hover:shadow-red-500/30",
      logoPath: "/logos/YTMusic.png"
    },
    {
      id: "spotify",
      name: "Spotify",
      color: "from-green-600 to-green-700",
      glow: "hover:shadow-green-500/30",
      logoPath: "/logos/spotify.png"
    },
    {
      id: "brave",
      name: "Brave",
      color: "from-orange-500 to-orange-600",
      glow: "hover:shadow-orange-500/30",
      logoPath: "/logos/brave.png"
    },
    {
      id: "camera",
      name: "Camera",
      color: "from-gray-500 to-gray-600",
      glow: "hover:shadow-gray-500/30",
      logoPath: "" // No logo for camera, will use fallback
    },
    {
      id: "controls",
      name: "Controls",
      color: "from-purple-500 to-purple-600",
      glow: "hover:shadow-purple-500/30",
      logoPath: "" // No logo for controls, will use fallback
    },
    {
      id: "settings",
      name: "Settings",
      color: "from-emerald-500 to-emerald-600",
      glow: "hover:shadow-emerald-500/30",
      logoPath: "" // No logo for settings, will use fallback
    },
  ]

  // Fallback emoji icons for apps without local logos
  const getFallbackIcon = (appId: string) => {
    const fallbackIcons: Record<string, string> = {
      "maps": "🗺️",
      "youtube": "▶️",
      "youtube-music": "🎵",
      "spotify": "🎵",
      "brave": "🦁",
      "camera": "📷",
      "controls": "⚙️",
      "settings": "🔧",
    }
    return fallbackIcons[appId] || "🚗"
  }

  // Theme-based background images
  const themeBackgrounds = {
    light: {
      image: "/background-images/lightmode-bg.jpg",
      overlay: "bg-white/40", // Light overlay for light mode
      blur: "backdrop-blur-sm" // Subtle blur for light mode
    },
    dark: {
      image: "/background-images/darkmode-bg.jpg", 
      overlay: "bg-black/50", // Darker overlay for dark mode
      blur: "backdrop-blur-md" // Stronger blur for dark mode
    }
  }

  // Theme-based styles
  const themeStyles = {
    light: {
      statusBar: "bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-700",
      headerText: "from-gray-800 to-gray-600",
      subText: "text-gray-500",
      footerText: "text-gray-400",
    },
    dark: {
      statusBar: "bg-gray-900/80 backdrop-blur-xl border-gray-700/50 text-gray-300",
      headerText: "from-gray-200 to-gray-400",
      subText: "text-gray-400",
      footerText: "text-gray-500",
    }
  }

  // Use theme from next-themes, fallback to light if not mounted
  const currentTheme = mounted ? (theme as 'light' | 'dark') : 'light'
  const background = themeBackgrounds[currentTheme]
  const styles = themeStyles[currentTheme]

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-500">
      
      {/* ✅ Background Image with Dynamic Theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url('${background.image}')`
        }}
      />
      
      {/* ✅ Overlay Blur Effect */}
      <div className={`absolute inset-0 ${background.overlay} ${background.blur} transition-all duration-500`} />
      
      {/* ✅ Enhanced Gradient Overlay for Better Readability */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        currentTheme === 'light' 
          ? 'from-blue-50/30 via-white/20 to-purple-50/30' 
          : 'from-gray-900/40 via-gray-800/30 to-purple-900/40'
      } transition-all duration-500`} />
      
      {/* CarPlay-inspired particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className={`absolute rounded-full ${
              currentTheme === 'light' ? 'bg-blue-300/30' : 'bg-blue-500/20'
            }`}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Small fast particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className={`absolute rounded-full ${
              currentTheme === 'light' ? 'bg-blue-300/40' : 'bg-blue-500/25'
            }`}
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
            style={{
              width: '1px',
              height: '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Slow drifting particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`slow-${i}`}
            className={`absolute rounded-full ${
              currentTheme === 'light' ? 'bg-blue-300/25' : 'bg-blue-500/15'
            }`}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div className={`absolute inset-0 bg-[linear-gradient(${
        currentTheme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)'
      }_1px,transparent_1px),linear-gradient(90deg,${
        currentTheme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)'
      }_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]`} />

      {/* Status Bar (CarPlay-like) */}
      <div className={`absolute top-0 left-0 right-0 px-6 py-3 flex justify-between items-center text-sm ${styles.statusBar} border-b z-20 transition-colors duration-500`}>
        <div className="flex items-center space-x-2">
          <motion.div 
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-medium">Connected</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium">18:45</span>
          <div className="flex items-center space-x-1">
            <div className={`w-6 h-3 border ${
              currentTheme === 'light' ? 'border-gray-400' : 'border-gray-500'
            } rounded-sm flex items-center justify-center ${
              currentTheme === 'light' ? 'bg-white/50' : 'bg-gray-800/50'
            }`}>
              <div className={`w-4 h-1 ${
                currentTheme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
              } rounded-full`} />
            </div>
            <span className="font-medium">100%</span>
          </div>
        </div>
      </div>

      {/* Header - NAVI */}
      <div className="absolute top-0 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-6xl font-bold bg-gradient-to-r ${styles.headerText} bg-clip-text text-transparent mb-3 tracking-tight`}
        >
          NAVI
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-lg ${styles.subText} tracking-widest font-light`}
        >
          2025 EDITION 
        </motion.p>
      </div>

      {/* Apps Grid with Enhanced Glass Morphism */}
      <div className="grid grid-cols-4 gap-6 w-full max-w-4xl px-4 relative z-10 mt-8">
        {apps.map((app, index) => (
          <motion.button
            key={app.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.08,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAppSelect(app.id)}
            className={`
              flex flex-col items-center justify-center
              w-full aspect-square
              rounded-3xl
              transition-all duration-300
              shadow-2xl hover:shadow-3xl
              bg-gradient-to-br ${app.color}
              ${app.glow}
              text-white font-semibold
              min-h-32
              backdrop-blur-lg
              border border-white/20
              hover:border-white/30
              relative overflow-hidden
              group
              transform-gpu
            `}
          >
            {/* Enhanced glass morphism overlay */}
            <div className="absolute inset-0 bg-white/15 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* App icon */}
            <div className="relative z-10 w-16 h-16 flex items-center justify-center mb-3">
              {app.logoPath ? (
                <img 
                  src={app.logoPath} 
                  alt={`${app.name} logo`}
                  className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    console.warn(`Failed to load local logo for ${app.name}`)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <span className="text-3xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  {getFallbackIcon(app.id)}
                </span>
              )}
            </div>
            
            {/* App name */}
            <span className="text-base text-center leading-tight relative z-10 drop-shadow-lg font-medium">
              {app.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Footer - Text Only (No Border) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-0 text-center px-4 relative z-10"
      >
        <div className="text-center">
          <p className={`text-sm tracking-widest font-light ${
            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            NaviCom <span className="mx-2 opacity-50">|</span>  2025
          </p>
          <p className={`text-xs mt-1 tracking-wide ${
            currentTheme === 'light' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Ivan Mercado 
          </p>
        </div>
      </motion.div>
    </div>
  )
}