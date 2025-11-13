//components\camera-view.tsx
// Fix: Optimize UI Tesla-like Camera View Component
"use client"

import React, { useState, useEffect } from "react"
import type { VehicleState } from "@/types/vehicle"

interface CameraViewProps {
  vehicleState: VehicleState
}

type CameraLayout = "full" | "pip" | "quad"
type CameraPosition = "front" | "rear" | "left" | "right"

export default function CameraView({ vehicleState }: CameraViewProps) {
  const [layout, setLayout] = useState<CameraLayout>("full")
  const [selectedCamera, setSelectedCamera] = useState<CameraPosition>("front")

  useEffect(() => {
    if (vehicleState.alarmTrip) {
      setLayout("quad")
    } else if (vehicleState.reverseOn) {
      setLayout("full")
      setSelectedCamera("rear")
    } else if (vehicleState.turnSignalLeft) {
      setLayout("full")
      setSelectedCamera("left")
    } else if (vehicleState.turnSignalRight) {
      setLayout("full")
      setSelectedCamera("right")
    } else if (selectedCamera !== "left" && selectedCamera !== "right") {
      // Only reset to front if user didn't manually select left/right
      setLayout("full")
      setSelectedCamera("front")
    }
  }, [vehicleState, selectedCamera])

  const CameraFeed = ({ label, camera }: { label: string; camera: CameraPosition }) => (
    <div className="relative w-full h-full bg-black/50 border border-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-sm font-bold text-accent mb-1">CAM</div>
          <div className="text-xs">{label} Camera Stream</div>
        </div>
      </div>
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-xs font-bold text-accent border border-accent/50">
        {label}
      </div>
      {vehicleState.recording && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-destructive/20 rounded">
          <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
          <span className="text-xs text-destructive font-bold">REC</span>
        </div>
      )}
    </div>
  )

  const renderLayout = () => {
    switch (layout) {
      case "full":
        return (
          <div className="flex-1 rounded-lg overflow-hidden border-2 border-accent/30">
            <CameraFeed label={selectedCamera.toUpperCase()} camera={selectedCamera} />
          </div>
        )
      case "pip":
        return (
          <>
            {selectedCamera !== "left" && selectedCamera !== "right" && (
              <div className="flex-1 rounded-lg overflow-hidden border-2 border-accent/30">
                <CameraFeed label="FRONT" camera="front" />
              </div>
            )}
            <div className="w-1/4 rounded-lg overflow-hidden border-2 border-accent">
              <CameraFeed label={selectedCamera.toUpperCase()} camera={selectedCamera} />
            </div>
          </>
        )
      case "quad":
        return (
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
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full h-full bg-background p-4 flex flex-col gap-4">
      {/* Main Camera Area */}
      <div className="flex-1 flex gap-4">{renderLayout()}</div>

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
