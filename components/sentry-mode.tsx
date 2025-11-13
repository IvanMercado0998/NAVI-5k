"use client"
 
// Tesla like Sentry Mode UI

import { AlertTriangle } from "lucide-react"
import CameraView from "@/components/camera-view"
import type { VehicleState } from "@/types/vehicle"

interface SentryModeProps {
  vehicleState: VehicleState
  onDisable: () => void
}

export default function SentryMode({ vehicleState, onDisable }: SentryModeProps) {
  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Alert Banner */}
      <div className="bg-destructive text-destructive-foreground px-6 py-4 flex items-center gap-4 animate-pulse">
        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">SENTRY MODE ACTIVATED</h3>
          <p className="text-sm">Alarm triggered - Recording all camera feeds</p>
        </div>
      </div>

      {/* Camera Feeds in Quad View */}
      <div className="flex-1 p-4">
        <CameraView vehicleState={vehicleState} />
      </div>

      {/* Control Footer */}
      <div className="bg-card border-t border-border px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
          <span className="text-sm font-bold text-foreground">Recording</span>
        </div>
        <button
          onClick={onDisable}
          className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          Disable Sentry
        </button>
      </div>
    </div>
  )
}
