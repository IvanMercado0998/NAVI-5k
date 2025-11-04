"use client"

import React, { useState } from "react"
import type { VehicleState } from "@/types/vehicle"

interface CameraViewProps {
  vehicleState: VehicleState
}

type CameraLayout = "full" | "pip" | "quad"

export default function CameraView({ vehicleState }: CameraViewProps) {
  const [layout, setLayout] = useState<CameraLayout>("full")
  const [selectedCamera, setSelectedCamera] = useState<"front" | "rear" | "left" | "right">("front")

  React.useEffect(() => {
    if (vehicleState.alarmTrip) {
      setLayout("quad")
    } else if (vehicleState.reverseOn) {
      setLayout("full")
      setSelectedCamera("rear")
    } else if (vehicleState.turnSignalLeft) {
      setLayout("pip")
      setSelectedCamera("left")
    } else if (vehicleState.turnSignalRight) {
      setLayout("pip")
      setSelectedCamera("right")
    } else {
      setLayout("full")
      setSelectedCamera("front")
    }
  }, [vehicleState])

  const CameraFeed = ({ label, camera }: { label: string; camera: "front" | "rear" | "left" | "right" }) => (
    <div className="relative w-full h-full bg-black/50 border border-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-sm font-bold text-accent mb-2">CAM</div>
          <div className="text-xs">{label} Camera Stream</div>
        </div>
      </div>

      {/* Camera label */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-xs font-bold text-accent border border-accent/50">
        {label}
      </div>

      {/* Recording indicator */}
      {vehicleState.recording && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-destructive/20 rounded">
          <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
          <span className="text-xs text-destructive font-bold">REC</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full h-full bg-background p-4 flex flex-col gap-4">
      {/* Main Camera Area */}
      <div className="flex-1 flex gap-4">
        {layout === "full" && (
          <div className="flex-1 rounded-lg overflow-hidden border-2 border-accent/30">
            <CameraFeed label={selectedCamera.toUpperCase()} camera={selectedCamera} />
          </div>
        )}

        {layout === "pip" && (
          <>
            {/* Main camera */}
            <div className="flex-1 rounded-lg overflow-hidden border-2 border-accent/30">
              <CameraFeed label="FRONT" camera="front" />
            </div>

            {/* Picture in Picture */}
            <div className="w-1/4 rounded-lg overflow-hidden border-2 border-accent">
              <CameraFeed label={selectedCamera.toUpperCase()} camera={selectedCamera} />
            </div>
          </>
        )}

        {layout === "quad" && (
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden border border-accent/50">
              <CameraFeed label="FRONT" camera="front" />
            </div>
            <div className="rounded-lg overflow-hidden border border-accent/50">
              <CameraFeed label="REAR" camera="rear" />
            </div>
            <div className="rounded-lg overflow-hidden border border-accent/50">
              <CameraFeed label="LEFT" camera="left" />
            </div>
            <div className="rounded-lg overflow-hidden border border-accent/50">
              <CameraFeed label="RIGHT" camera="right" />
            </div>
          </div>
        )}
      </div>

      {/* Manual Camera Selection */}
      <div className="flex gap-2 px-4">
        {(["front", "rear", "left", "right"] as const).map((cam) => (
          <button
            key={cam}
            onClick={() => {
              setSelectedCamera(cam)
              setLayout("full")
            }}
            className={`px-4 py-2 rounded font-bold text-xs transition-all ${
              selectedCamera === cam
                ? "bg-foreground text-background border border-foreground"
                : "bg-card text-foreground border border-border hover:bg-secondary"
            }`}
          >
            {cam.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
