/**
 * Camera API Route
 * Provides REST endpoints for camera operations
 */

import { type NextRequest, NextResponse } from "next/server"
import { getCameraManager } from "@/lib/camera-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const cameraId = searchParams.get("camera")

    const cameraManager = getCameraManager()

    switch (action) {
      case "list":
        return NextResponse.json({
          cameras: cameraManager.getCameras(),
        })

      case "stats":
        return NextResponse.json({
          stats: cameraManager.getStorageStats(),
        })

      case "segments":
        if (!cameraId) {
          return NextResponse.json({ error: "Camera ID required" }, { status: 400 })
        }
        const segments = cameraManager.getTriggeredSegments(cameraId)
        return NextResponse.json({ segments })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (err) {
    console.error("[v0] Camera API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, camera } = body

    const cameraManager = getCameraManager()

    switch (action) {
      case "start-stream":
        const streamStarted = await cameraManager.startStreaming(camera)
        return NextResponse.json({ success: streamStarted })

      case "stop-stream":
        const streamStopped = await cameraManager.stopStreaming(camera)
        return NextResponse.json({ success: streamStopped })

      case "start-recording":
        const recStarted = cameraManager.startRecording(camera)
        return NextResponse.json({ success: recStarted })

      case "stop-recording":
        const recStopped = cameraManager.stopRecording(camera)
        return NextResponse.json({ success: recStopped })

      case "trigger-recording":
        const triggered = cameraManager.addSegment(camera, Buffer.from("mock-video-data"), true)
        return NextResponse.json({ success: triggered })

      case "export":
        const { output, lookback } = body
        const exported = await cameraManager.exportTriggeredSegments(camera, output, lookback)
        return NextResponse.json({ success: exported })

      case "cleanup":
        cameraManager.cleanup()
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (err) {
    console.error("[v0] Camera API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
