"use client"

import { useEffect, useState, useCallback } from "react"

interface SerialEvent {
  type: string
  data: any
  timestamp: number
}

export function useSerial() {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<SerialEvent[]>([])
  const [error, setError] = useState<string | null>(null)

  // Connect to serial
  const connect = useCallback(async (port = "COM3") => {
    try {
      const response = await fetch("/api/serial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", port }),
      })

      const data = await response.json()
      if (data.success) {
        setConnected(true)
        setError(null)
      } else {
        setError("Failed to connect")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
    }
  }, [])

  // Disconnect from serial
  const disconnect = useCallback(async () => {
    try {
      await fetch("/api/serial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      })
      setConnected(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnection failed")
    }
  }, [])

  // Send command
  const sendCommand = useCallback(async (command: string, data?: Record<string, any>) => {
    try {
      const response = await fetch("/api/serial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-command", command, data }),
      })

      const result = await response.json()
      return result.success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Command failed")
      return false
    }
  }, [])

  // Check status periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/serial?action=status")
        const data = await response.json()
        setConnected(data.connected)
      } catch (err) {
        // Silently fail on status check
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return {
    connected,
    events,
    error,
    connect,
    disconnect,
    sendCommand,
  }
}
