/**
 * Camera Management System
 * Handles UVC camera detection, streaming, and recording
 */

import fs from "fs"
import path from "path"

export interface CameraInfo {
  id: string
  name: string
  path: string
  resolution: string
  fps: number
  streaming: boolean
}

export interface RecordingSegment {
  id: string
  cameraId: string
  startTime: number
  endTime: number
  filePath: string
  size: number
  triggered: boolean
}

export class CameraManager {
  private cameras: Map<string, CameraInfo> = new Map()
  private recordingBuffer: Map<string, RecordingSegment[]> = new Map()
  private recordingDirectory: string
  private maxSegmentDuration = 60000 // 1 minute per segment
  private maxBufferSize = 120 * 1024 * 1024 // 120 MB total

  constructor(recordingDirectory = "./recordings") {
    this.recordingDirectory = recordingDirectory
    this.ensureRecordingDirectory()
    this.initializeCameras()
  }

  /**
   * Ensure recording directory exists
   */
  private ensureRecordingDirectory() {
    if (!fs.existsSync(this.recordingDirectory)) {
      fs.mkdirSync(this.recordingDirectory, { recursive: true })
    }
  }

  /**
   * Initialize camera detection
   */
  private initializeCameras() {
    // Mock camera initialization
    // In production, would use ffmpeg or Media Foundation to detect UVC devices
    const mockCameras = [
      {
        id: "front",
        name: "Front Camera",
        path: "/dev/video0",
        resolution: "1920x1080",
        fps: 30,
        streaming: false,
      },
      {
        id: "rear",
        name: "Rear Camera",
        path: "/dev/video1",
        resolution: "1920x1080",
        fps: 30,
        streaming: false,
      },
      {
        id: "left",
        name: "Left Camera",
        path: "/dev/video2",
        resolution: "1280x720",
        fps: 30,
        streaming: false,
      },
      {
        id: "right",
        name: "Right Camera",
        path: "/dev/video3",
        resolution: "1280x720",
        fps: 30,
        streaming: false,
      },
    ]

    mockCameras.forEach((cam) => {
      this.cameras.set(cam.id, cam)
      this.recordingBuffer.set(cam.id, [])
    })

    console.log("[v0] Cameras initialized:", mockCameras.length)
  }

  /**
   * Get all available cameras
   */
  getCameras(): CameraInfo[] {
    return Array.from(this.cameras.values())
  }

  /**
   * Get camera by ID
   */
  getCamera(cameraId: string): CameraInfo | undefined {
    return this.cameras.get(cameraId)
  }

  /**
   * Start streaming from camera
   */
  async startStreaming(cameraId: string): Promise<boolean> {
    const camera = this.cameras.get(cameraId)
    if (!camera) return false

    camera.streaming = true
    console.log("[v0] Streaming started:", cameraId)
    return true
  }

  /**
   * Stop streaming from camera
   */
  async stopStreaming(cameraId: string): Promise<boolean> {
    const camera = this.cameras.get(cameraId)
    if (!camera) return false

    camera.streaming = false
    console.log("[v0] Streaming stopped:", cameraId)
    return true
  }

  /**
   * Start recording to circular buffer
   */
  startRecording(cameraId: string): boolean {
    const camera = this.cameras.get(cameraId)
    if (!camera) return false

    console.log("[v0] Recording started for camera:", cameraId)
    return true
  }

  /**
   * Stop recording
   */
  stopRecording(cameraId: string): boolean {
    const camera = this.cameras.get(cameraId)
    if (!camera) return false

    console.log("[v0] Recording stopped for camera:", cameraId)
    return true
  }

  /**
   * Add recording segment to buffer
   */
  addSegment(cameraId: string, data: Buffer, triggered = false): boolean {
    const segments = this.recordingBuffer.get(cameraId)
    if (!segments) return false

    const segment: RecordingSegment = {
      id: `${cameraId}-${Date.now()}`,
      cameraId,
      startTime: Date.now(),
      endTime: Date.now(),
      filePath: path.join(this.recordingDirectory, `${cameraId}-${Date.now()}.h264`),
      size: data.length,
      triggered,
    }

    // Write segment to disk
    try {
      fs.writeFileSync(segment.filePath, data)
      segments.push(segment)

      // Trim old segments if buffer exceeds max size
      this.trimBuffer(cameraId)

      console.log("[v0] Segment recorded:", {
        camera: cameraId,
        size: data.length,
        triggered,
      })

      return true
    } catch (err) {
      console.error("[v0] Failed to write segment:", err)
      return false
    }
  }

  /**
   * Trim buffer to max size
   */
  private trimBuffer(cameraId: string) {
    const segments = this.recordingBuffer.get(cameraId)
    if (!segments) return

    let totalSize = 0
    for (const seg of segments) {
      totalSize += seg.size
    }

    // Remove oldest non-triggered segments
    while (totalSize > this.maxBufferSize && segments.length > 0) {
      const oldSegment = segments.shift()
      if (oldSegment && !oldSegment.triggered) {
        try {
          fs.unlinkSync(oldSegment.filePath)
          totalSize -= oldSegment.size
          console.log("[v0] Old segment deleted:", oldSegment.id)
        } catch (err) {
          console.error("[v0] Failed to delete segment:", err)
        }
      }
    }
  }

  /**
   * Get triggered segments (last N seconds + triggered clips)
   */
  getTriggeredSegments(cameraId: string, lookbackSeconds = 120): RecordingSegment[] {
    const segments = this.recordingBuffer.get(cameraId)
    if (!segments) return []

    const now = Date.now()
    const lookbackMs = lookbackSeconds * 1000

    return segments.filter((seg) => {
      // Include triggered segments
      if (seg.triggered) return true
      // Include recent segments (lookback period)
      if (now - seg.endTime < lookbackMs) return true
      return false
    })
  }

  /**
   * Export triggered segments
   */
  async exportTriggeredSegments(cameraId: string, outputPath: string, lookbackSeconds = 120): Promise<boolean> {
    const segments = this.getTriggeredSegments(cameraId, lookbackSeconds)
    if (segments.length === 0) return false

    try {
      // Create output file
      const outputFile = fs.createWriteStream(outputPath)

      for (const segment of segments) {
        const data = fs.readFileSync(segment.filePath)
        outputFile.write(data)
      }

      outputFile.end()

      console.log("[v0] Segments exported:", {
        camera: cameraId,
        count: segments.length,
        output: outputPath,
      })

      return true
    } catch (err) {
      console.error("[v0] Export failed:", err)
      return false
    }
  }

  /**
   * Mark segment as triggered
   */
  markSegmentTriggered(segmentId: string): boolean {
    for (const segments of this.recordingBuffer.values()) {
      const segment = segments.find((s) => s.id === segmentId)
      if (segment) {
        segment.triggered = true
        console.log("[v0] Segment marked as triggered:", segmentId)
        return true
      }
    }
    return false
  }

  /**
   * Cleanup old recordings
   */
  cleanup(): void {
    try {
      const files = fs.readdirSync(this.recordingDirectory)
      const now = Date.now()
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

      files.forEach((file) => {
        const filePath = path.join(this.recordingDirectory, file)
        const stats = fs.statSync(filePath)

        if (now - stats.mtimeMs > thirtyDaysMs) {
          fs.unlinkSync(filePath)
          console.log("[v0] Old recording deleted:", file)
        }
      })
    } catch (err) {
      console.error("[v0] Cleanup failed:", err)
    }
  }

  /**
   * Get storage statistics
   */
  getStorageStats(): {
    totalSize: number
    fileCount: number
    availableSpace: number
  } {
    try {
      let totalSize = 0
      let fileCount = 0

      const files = fs.readdirSync(this.recordingDirectory)
      files.forEach((file) => {
        const filePath = path.join(this.recordingDirectory, file)
        const stats = fs.statSync(filePath)
        totalSize += stats.size
        fileCount += 1
      })

      return {
        totalSize,
        fileCount,
        availableSpace: this.maxBufferSize - totalSize,
      }
    } catch (err) {
      console.error("[v0] Failed to get storage stats:", err)
      return { totalSize: 0, fileCount: 0, availableSpace: this.maxBufferSize }
    }
  }
}

// Singleton instance
let instance: CameraManager | null = null

export function getCameraManager(): CameraManager {
  if (!instance) {
    instance = new CameraManager()
  }
  return instance
}
