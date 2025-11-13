// components/vehicle-simulator.tsx
/**
 * NAVI Infotainment System - Vehicle State Simulator
 * 
 * @component
 * @description
 * Interactive vehicle state simulation panel for testing and demonstrating
 * automotive functionality within the NAVI infotainment system. Provides
 * real-time control over vehicle states with audio feedback for enhanced
 * user experience and system validation.
 * 
 * @version 1.0.0
 * @author Ivan Mercado
 * @created 2025
 * 
 * @features
 * - Reverse gear simulation with continuous audio feedback
 * - Left and right turn signal controls
 * - Alarm/sentry mode activation
 * - Real-time state visualization
 * - Professional automotive-grade UI design
 * - Audio-enhanced user interactions with looping sounds
 * 
 * @props {Object} vehicleState - Vehicle state management object containing:
 *   @prop {boolean} reverseOn - Current reverse gear state
 *   @prop {boolean} turnSignalLeft - Left turn signal state
 *   @prop {boolean} turnSignalRight - Right turn signal state
 *   @prop {boolean} sentryMode - Alarm/sentry mode state
 *   @prop {function} setReverse - Toggle reverse gear state
 *   @prop {function} setTurnSignalLeft - Toggle left turn signal
 *   @prop {function} setTurnSignalRight - Toggle right turn signal
 *   @prop {function} setAlarmTrip - Toggle alarm/sentry mode
 * 
 * @audio
 * - Path: /sounds/reverse-sound.mp3
 * - Format: MP3
 * - Timing: Plays in continuous loop while reverse gear is engaged
 * - Volume: 0.9 (90%) for authentic vehicle feedback
 * - Purpose: Provides continuous auditory feedback for reverse gear engagement
 * 
 * @controls
 * - Reverse: Toggles reverse gear with continuous audio feedback
 * - Left Turn: Activates/deactivates left turn signal
 * - Right Turn: Activates/deactivates right turn signal
 * - Alarm: Engages/disengages vehicle security system
 * 
 * @states
 * - Visual state indicators with checkmarks and warnings
 * - Color-coded button states (normal/warning/destructive)
 * - Real-time status display panel
 * - Pulsing animation for active alarm state
 * - Continuous audio loop management for reverse gear
 * 
 * @design
 * - Card-based layout with clean borders
 * - Consistent spacing and typography hierarchy
 * - Intuitive toggle states with clear visual feedback
 * - Accessibility-compliant contrast ratios
 * - Responsive button sizing and hover states
 */

"use client"

import { useState } from "react"
import type { VehicleState } from "@/types/vehicle"

interface VehicleSimulatorProps {
  vehicleState: VehicleState & {
    setReverse: (value: boolean) => void
    setTurnSignalLeft: (value: boolean) => void
    setTurnSignalRight: (value: boolean) => void
    setAlarmTrip: (value: boolean) => void
  }
}

export default function VehicleSimulator({ vehicleState }: VehicleSimulatorProps) {
  const [autoSim, setAutoSim] = useState(false)
  const [reverseAudio, setReverseAudio] = useState<HTMLAudioElement | null>(null)

  // Audio handler for reverse gear feedback - plays in continuous loop
  const playReverseSound = () => {
    const audio = new Audio('/sounds/reverse-sound.mp3')
    audio.volume = 1. // Appropriate volume for vehicle feedback
    audio.loop = true // Enable continuous looping while reverse is engaged
    audio.play().catch(error => {
      console.log('Reverse sound play failed:', error)
    })
    return audio // Return audio instance for later control
  }

  // Stop reverse sound function
  const stopReverseSound = (audio: HTMLAudioElement) => {
    audio.pause()
    audio.currentTime = 0 // Reset to beginning
    audio.loop = false // Disable looping
  }

  const handleReverse = () => {
    const newReverseState = !vehicleState.reverseOn
    vehicleState.setReverse(newReverseState)
    
    if (newReverseState) {
      // Engage reverse - play continuous looping sound
      const audio = playReverseSound()
      setReverseAudio(audio)
    } else {
      // Disengage reverse - stop looping sound
      if (reverseAudio) {
        stopReverseSound(reverseAudio)
        setReverseAudio(null)
      }
    }
  }

  const handleTurnLeft = () => {
    vehicleState.setTurnSignalLeft(!vehicleState.turnSignalLeft)
  }

  const handleTurnRight = () => {
    vehicleState.setTurnSignalRight(!vehicleState.turnSignalRight)
  }

  const handleAlarm = () => {
    vehicleState.setAlarmTrip(!vehicleState.sentryMode)
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Vehicle Simulator</h3>

      <div className="space-y-3">
        {/* Reverse Control with Continuous Audio Feedback */}
        <button
          onClick={handleReverse}
          className={`w-full px-4 py-3 rounded-lg font-bold transition-all ${
            vehicleState.reverseOn
              ? "bg-foreground text-background"
              : "bg-muted text-foreground border border-border hover:bg-secondary"
          }`}
        >
          {vehicleState.reverseOn ? "✓ REVERSE ON" : "REVERSE"}
        </button>

        {/* Turn Left Control */}
        <button
          onClick={handleTurnLeft}
          className={`w-full px-4 py-3 rounded-lg font-bold transition-all ${
            vehicleState.turnSignalLeft
              ? "bg-foreground text-background"
              : "bg-muted text-foreground border border-border hover:bg-secondary"
          }`}
        >
          {vehicleState.turnSignalLeft ? "✓ LEFT TURN ON" : "LEFT TURN"}
        </button>

        {/* Turn Right Control */}
        <button
          onClick={handleTurnRight}
          className={`w-full px-4 py-3 rounded-lg font-bold transition-all ${
            vehicleState.turnSignalRight
              ? "bg-foreground text-background"
              : "bg-muted text-foreground border border-border hover:bg-secondary"
          }`}
        >
          {vehicleState.turnSignalRight ? "✓ RIGHT TURN ON" : "RIGHT TURN"}
        </button>

        {/* Alarm/Sentry Mode Control */}
        <button
          onClick={handleAlarm}
          className={`w-full px-4 py-3 rounded-lg font-bold transition-all ${
            vehicleState.sentryMode
              ? "bg-destructive text-destructive-foreground animate-pulse"
              : "bg-muted text-foreground border border-border hover:bg-secondary"
          }`}
        >
          {vehicleState.sentryMode ? "⚠ ALARM ACTIVE" : "TRIGGER ALARM"}
        </button>
      </div>

      {/* Status Display */}
      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
        <div>Reverse: {vehicleState.reverseOn ? "ON" : "OFF"}</div>
        <div>Left Turn: {vehicleState.turnSignalLeft ? "ON" : "OFF"}</div>
        <div>Right Turn: {vehicleState.turnSignalRight ? "ON" : "OFF"}</div>
        <div>Sentry: {vehicleState.sentryMode ? "ACTIVE" : "INACTIVE"}</div>
      </div>
    </div>
  )
}