"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showSubtitle, setShowSubtitle] = useState(false)

  useEffect(() => {
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 700)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => {
      clearTimeout(subtitleTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden z-50">
      {/* Main NAVI text with boot animation */}
      <div className="relative flex flex-col items-center">
        <h1 className="font-bold text-black dark:text-white animate-boot-text-2sec leading-none">NAVI</h1>

        {/* Subtitle with fade-in animation */}
        {showSubtitle && (
          <div className="animate-boot-subtitle-2sec absolute top-full mt-4 text-gray-600 dark:text-gray-400 text-sm font-medium whitespace-nowrap">
            NaviCo by Ivan Mercado
          </div>
        )}
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
        <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
        <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
      </div>
    </div>
  )
}
