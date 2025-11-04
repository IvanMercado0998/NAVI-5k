"use client"

import { useState, useEffect } from "react"
import type { VehicleState } from "@/types/vehicle"

const initialState: VehicleState = {
  ignitionOn: false,
  reverseOn: false,
  turnSignalLeft: false,
  turnSignalRight: false,
  alarmTrip: false,
  recording: false,
  sentryMode: false,
  voltage: 13.5,
  temperature: 22,
  speed: 0,
}

export function useVehicleState() {
  const [state, setState] = useState<VehicleState>(initialState)

  // Simulate vehicle state changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        voltage: Math.max(10.5, Math.min(14.4, prev.voltage + (Math.random() - 0.5) * 0.2)),
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5))),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return state
}
