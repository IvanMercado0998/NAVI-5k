"use client"

import { useState } from "react"
import type { VehicleState } from "@/types/vehicle"
import MediaPlayer from "./media-player"
import ClimateControl from "./climate-control"

interface ControlPanelProps {
  vehicleState: VehicleState
}

export default function ControlPanel({ vehicleState }: ControlPanelProps) {
  const [activeSection, setActiveSection] = useState<"media" | "climate">("media")

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border pb-4">
          {(["media", "climate"] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-2 font-bold text-sm transition-all ${
                activeSection === section
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-secondary hover:text-foreground"
              }`}
            >
              {section === "media" ? "MEDIA" : "CLIMATE"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {activeSection === "media" && <MediaPlayer />}
          {activeSection === "climate" && <ClimateControl vehicleState={vehicleState} />}
        </div>
      </div>
    </div>
  )
}
