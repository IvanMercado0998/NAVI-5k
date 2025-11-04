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

  const handleReverse = () => {
    vehicleState.setReverse(!vehicleState.reverseOn)
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
        {/* Reverse Control */}
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
