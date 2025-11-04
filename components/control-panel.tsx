"use client"

import { useState } from "react"
import type { VehicleState } from "@/types/vehicle"
import MediaPlayer from "./media-player"
import ClimateControl from "./climate-control"
import VehicleSimulator from "./vehicle-simulator"

interface ControlPanelProps {
  vehicleState: VehicleState & {
    setReverse?: (value: boolean) => void
    setTurnSignalLeft?: (value: boolean) => void
    setTurnSignalRight?: (value: boolean) => void
    setAlarmTrip?: (value: boolean) => void
  }
}

export default function ControlPanel({ vehicleState }: ControlPanelProps) {
  const [activeSection, setActiveSection] = useState<"media" | "climate" | "simulator">("media")

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
          {(["media", "climate", "simulator"] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-2 font-bold text-sm transition-all whitespace-nowrap ${
                activeSection === section
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section === "media" ? "MEDIA" : section === "climate" ? "CLIMATE" : "SIMULATOR"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {activeSection === "media" && <MediaPlayer />}
          {activeSection === "climate" && <ClimateControl vehicleState={vehicleState} />}
          {activeSection === "simulator" && vehicleState.setReverse && (
            <VehicleSimulator vehicleState={vehicleState as any} />
          )}
        </div>
      </div>
    </div>
  )
}
