// components/splash-screen.tsx
// fix the theme call logic issue it is not accurate  
/** COMMAND: DO NOT CHANGE LOGIC!!!!!
 * NAVI Infotainment System - Splash Screen Component
 * 
 * @component
 * @description
 * Professional animated startup screen with audio feedback for the NAVI automotive infotainment system.
 * Features synchronized visual animations with startup sound for enhanced user experience.
 * 
 * @version 2.0.0
 * @author Ivan Mercado
 * @created 2025
 * 
 * @features
 * - Animated brand reveal with sequential timing
 * - Integrated startup sound playback
 * - Responsive loading indicators
 * - Automatic cleanup and resource management
 * - Dark/light theme compatibility with proper theme management
 * - Background images with synchronized zoom and blur overlay
 * - Quicker startup sequence (1800ms total)
 * - Theme toggle in upper right corner
 * 
 * @props {function} onComplete - Callback function executed when splash sequence completes
 * 
 * @audio
 * - Path: /sounds/startup-sound.mp3
 * - Format: MP3
 * - Timing: Plays immediately on component mount
 * 
 * @animations
 * - Boot text animation: 1-second reveal
 * - Subtitle fade-in: 400ms delay
 * - Loading dots: Sequential pulsing
 * - Background zoom: Synchronized with audio (1800ms)
 * - Blur overlay: Constant elegant overlay
 * - Total duration: 1800ms
 * 
 * @usage
 * <SplashScreen onComplete={handleSplashComplete} />
 */

"use client"

import { useEffect, useState, useRef } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [zoomComplete, setZoomComplete] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null) // Start as null to prevent flash
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Correct timing constants
  const TOTAL_DURATION = 1800;
  const SUBTITLE_DELAY = 400;

  // Initialize theme from localStorage or system preference - FIXED LOGIC
  useEffect(() => {
    const getInitialTheme = (): boolean => {
      // Check localStorage first
      const storedTheme = localStorage.getItem('theme')
      if (storedTheme) {
        return storedTheme === 'dark'
      }
      
      // Fall back to system preference
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      // Default to light mode if nothing else works
      return false
    }

    const initialDarkMode = getInitialTheme()
    setIsDarkMode(initialDarkMode)
    
    // Apply theme to document immediately
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Listen for system theme changes (only if no stored preference)
    const storedTheme = localStorage.getItem('theme')
    if (!storedTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          setIsDarkMode(e.matches)
          if (e.matches) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      }

      mediaQuery.addEventListener('change', handleSystemThemeChange)
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  // Toggle theme function - follows proper theme management
  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the main click handler
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    // Update DOM and localStorage
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Handle user interaction to enable audio - ONLY for startup
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
  }

  useEffect(() => {
    // Add event listeners for user interaction
    const events = ['click', 'touchstart', 'keydown']
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [])

  useEffect(() => {
    // Create audio element with proper attributes for autoplay
    audioRef.current = new Audio('/sounds/startup-sound.mp3')
    audioRef.current.preload = 'auto'
    audioRef.current.volume = 0.8

    const playStartupSound = async () => {
      try {
        // Only play if user has interacted or we're in a supported autoplay context
        if (hasInteracted || document.visibilityState === 'visible') {
          await audioRef.current?.play()
          console.log('Startup sound playing automatically')
        }
      } catch (error) {
        console.log('Startup sound autoplay failed, will play on interaction:', error)
        // If autoplay fails, play on next user interaction
        const playOnInteraction = () => {
          audioRef.current?.play().catch(() => {})
          document.removeEventListener('click', playOnInteraction)
          document.removeEventListener('touchstart', playOnInteraction)
        }
        document.addEventListener('click', playOnInteraction, { once: true })
        document.addEventListener('touchstart', playOnInteraction, { once: true })
      }
    }

    // Play sound immediately when component mounts and user has interacted
    if (hasInteracted) {
      playStartupSound()
    } else {
      // Try to play when component becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          playStartupSound()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // Also try to play after a short delay as fallback
      const delayedPlay = setTimeout(() => {
        playStartupSound()
      }, 100)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        clearTimeout(delayedPlay)
      }
    }

    const subtitleTimer = setTimeout(() => setShowSubtitle(true), SUBTITLE_DELAY)

    // Mark zoom as complete when audio finishes
    const zoomCompleteTimer = setTimeout(() => {
      setZoomComplete(true)
    }, TOTAL_DURATION)

    const completeTimer = setTimeout(() => {
      // Stop audio when splash completes
      audioRef.current?.pause()
      audioRef.current = null
      onComplete()
    }, TOTAL_DURATION)

    return () => {
      clearTimeout(subtitleTimer)
      clearTimeout(zoomCompleteTimer)
      clearTimeout(completeTimer)
      // Cleanup audio on unmount
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [onComplete, hasInteracted])

  // Don't render until theme is determined to prevent flash
  if (isDarkMode === null) {
    return (
      <div className="fixed inset-0 bg-background z-50" />
    )
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-hidden z-50 cursor-pointer"
      onClick={handleUserInteraction}
    >
      {/* Background Images for Light and Dark Mode with Zoom Animation */}
      <div className="absolute inset-0">
        {/* Light Mode Background */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform ease-out ${
            zoomComplete ? 'scale-110' : 'scale-100'
          } ${!isDarkMode ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: "url('/background-images/lightmode-bg.jpg')",
            transitionDuration: `${TOTAL_DURATION}ms`,
            transitionProperty: 'transform, opacity'
          }}
        />
        
        {/* Dark Mode Background */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform ease-out ${
            zoomComplete ? 'scale-110' : 'scale-100'
          } ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: "url('/background-images/darkmode-bg.jpg')",
            transitionDuration: `${TOTAL_DURATION}ms`,
            transitionProperty: 'transform, opacity'
          }}
        />
        
        {/* Constant Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/10 dark:bg-white/5" />
        
        {/* Additional Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 dark:to-white/10" />
      </div>

      {/* Theme Toggle - Upper Right Corner - Proper theme management */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-black/20 dark:bg-white/20 backdrop-blur-md border border-white/30 dark:border-black/30 hover:bg-black/30 dark:hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          <svg 
            className="w-6 h-6 text-white dark:text-black transition-all duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isDarkMode ? (
              // Sun icon for light mode
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            ) : (
              // Moon icon for dark mode
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Main NAVI text with boot animation */}
        <h1 className="font-bold text-black dark:text-white text-6xl md:text-7xl lg:text-8xl boot-text-animation leading-none drop-shadow-lg">
          NAVI
        </h1>

        {/* Subtitle with fade-in animation */}
        {showSubtitle && (
          <div className="subtitle-animation absolute top-full mt-4 text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap drop-shadow">
            NaviCom | Ivan Mercado
          </div>
        )}
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
        <div className="w-2 h-2 bg-foreground rounded-full pulse-fast" />
        <div className="w-2 h-2 bg-foreground rounded-full pulse-fast" style={{ animationDelay: "0.1s" }} />
        <div className="w-2 h-2 bg-foreground rounded-full pulse-fast" style={{ animationDelay: "0.2s" }} />
      </div>

      {/* Instruction for first-time users (only shows if sound hasn't played) */}
      {!hasInteracted && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 dark:text-gray-400 pulse z-10">
          Tap anywhere to start
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        .boot-text-animation {
          animation: bootText 1s ease-out forwards;
        }
        
        .subtitle-animation {
          animation: bootSubtitle 0.8s ease-out forwards;
        }
        
        .pulse-fast {
          animation: pulseFast 0.6s ease-in-out infinite;
        }
        
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes bootText {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bootSubtitle {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseFast {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
};
