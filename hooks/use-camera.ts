"use client"

import { useEffect, useState, useCallback } from "react"

export interface CameraInfo {
  id: string
  name: string
  path: string
  resolution: string
  fps: number
  streaming: boolean
}

export interface StorageStats {
  totalSize: number
  fileCount: number
  availableSpace: number
}

export function useCamera() {
  const [cameras, setCameras] = useState<CameraInfo[]>([])
  const [stats, setStats] = useState<StorageStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cameras on mount
  useEffect(() => {
    fetchCameras()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchCameras = useCallback(async () => {
    try {
      const response = await fetch("/api/camera?action=list")
      const data = await response.json()
      setCameras(data.cameras || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cameras")
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/camera?action=stats")
      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      // Silently fail on stats fetch
    }
  }, [])

  const startStream = useCallback(
    async (cameraId: string) => {
      try {
        setLoading(true)
        const response = await fetch("/api/camera", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start-stream", camera: cameraId }),
        })
        const data = await response.json()
        if (data.success) {
          await fetchCameras()
        }
        return data.success
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start stream")
        return false
      } finally {
        setLoading(false)
      }
    },
    [fetchCameras],
  )

  const stopStream = useCallback(
    async (cameraId: string) => {
      try {
        setLoading(true)
        const response = await fetch("/api/camera", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "stop-stream", camera: cameraId }),
        })
        const data = await response.json()
        if (data.success) {
          await fetchCameras()
        }
        return data.success
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to stop stream")
        return false
      } finally {
        setLoading(false)
      }
    },
    [fetchCameras],
  )

  return {
    cameras,
    stats,
    loading,
    error,
    fetchCameras,
    fetchStats,
    startStream,
    stopStream,
  }
}
