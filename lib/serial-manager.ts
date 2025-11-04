/**
 * Serial Communication Manager
 * Handles USB-Serial communication with ESP32
 */

import { SerialPort } from "serialport"
import { ReadlineParser } from "@serialport/parser-readline"
import { encodeMessage, decodeMessage, MessageType, EventType, createCommandPayload } from "./serial-protocol"

interface PendingAck {
  eventId: number
  timestamp: number
  retries: number
  resolve: (value: boolean) => void
}

export class SerialManager {
  private port: SerialPort | null = null
  private parser: ReadlineParser | null = null
  private isConnected = false
  private pendingAcks: Map<number, PendingAck> = new Map()
  private listeners: Map<string, ((data: any) => void)[]> = new Map()
  private lastHeartbeat = Date.now()
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {}

  /**
   * Connect to ESP32 serial port
   */
  async connect(portName = "COM3", baudRate = 115200): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.port = new SerialPort(
          {
            path: portName,
            baudRate,
            dataBits: 8,
            stopBits: 1,
            parity: "none",
          },
          (err) => {
            if (err) {
              console.error("[v0] Serial connection failed:", err.message)
              resolve(false)
              return
            }

            console.log("[v0] Serial connected to", portName, "@", baudRate)
            this.isConnected = true
            this.setupParser()
            this.startHeartbeat()
            resolve(true)
          },
        )
      } catch (err) {
        console.error("[v0] Serial connection error:", err)
        resolve(false)
      }
    })
  }

  /**
   * Setup data parser
   */
  private setupParser() {
    if (!this.port) return

    this.parser = new ReadlineParser({ delimiter: "\r\n" })
    this.port.pipe(this.parser)

    this.parser.on("data", (line: string) => {
      this.handleSerialData(line)
    })

    this.parser.on("error", (err) => {
      console.error("[v0] Parser error:", err)
    })

    this.port.on("error", (err) => {
      console.error("[v0] Port error:", err)
      this.disconnect()
    })

    this.port.on("close", () => {
      console.log("[v0] Serial port closed")
      this.isConnected = false
      this.stopHeartbeat()
    })
  }

  /**
   * Handle incoming serial data
   */
  private handleSerialData(data: string) {
    try {
      // Try parsing as hex binary message
      const buffer = Buffer.from(data, "hex")
      const message = decodeMessage(buffer)

      if (!message) {
        console.log("[v0] Invalid message format:", data)
        return
      }

      switch (message.type) {
        case MessageType.EVENT:
          this.handleEvent(message.payload)
          this.sendAck(message.payload[0])
          break
        case MessageType.ACK:
          this.handleAck(message.payload[0])
          break
        default:
          console.log("[v0] Unknown message type:", message.type)
      }
    } catch (err) {
      console.error("[v0] Failed to parse serial data:", err)
    }
  }

  /**
   * Handle event from ESP32
   */
  private handleEvent(payload: Buffer) {
    const eventId = payload[0]
    const timestamp = Date.now()

    console.log("[v0] Event received:", {
      eventId,
      timestamp,
      payload: payload.toString("hex"),
    })

    // Emit event to listeners
    switch (eventId) {
      case EventType.REVERSE_ON:
        this.emit("reverse-on", { timestamp })
        break
      case EventType.REVERSE_OFF:
        this.emit("reverse-off", { timestamp })
        break
      case EventType.TURN_LEFT_ON:
        this.emit("turn-left-on", { timestamp })
        break
      case EventType.TURN_LEFT_OFF:
        this.emit("turn-left-off", { timestamp })
        break
      case EventType.TURN_RIGHT_ON:
        this.emit("turn-right-on", { timestamp })
        break
      case EventType.TURN_RIGHT_OFF:
        this.emit("turn-right-off", { timestamp })
        break
      case EventType.ALARM_TRIP:
        this.emit("alarm-trip", { timestamp, source: "door_sensor" })
        break
      case EventType.LOW_BATT:
        const voltage = payload.readUInt16BE(1) * 0.1
        this.emit("low-battery", { voltage, timestamp })
        break
      case EventType.IGNITION_ON:
        this.emit("ignition-on", { timestamp })
        break
      case EventType.IGNITION_OFF:
        this.emit("ignition-off", { timestamp })
        break
      default:
        console.log("[v0] Unknown event type:", eventId)
    }
  }

  /**
   * Handle ACK from ESP32
   */
  private handleAck(eventId: number) {
    const pending = this.pendingAcks.get(eventId)
    if (pending) {
      console.log("[v0] ACK received for event:", eventId)
      this.pendingAcks.delete(eventId)
      pending.resolve(true)
    }
  }

  /**
   * Send ACK to ESP32
   */
  private sendAck(eventId: number) {
    if (!this.port) return

    try {
      const payload = Buffer.from([eventId])
      const message = encodeMessage(MessageType.ACK, payload)
      this.port.write(message)
      console.log("[v0] ACK sent for event:", eventId)
    } catch (err) {
      console.error("[v0] Failed to send ACK:", err)
    }
  }

  /**
   * Send command to ESP32
   */
  async sendCommand(commandId: number, data?: Record<string, any>): Promise<boolean> {
    if (!this.port) return false

    try {
      const payload = createCommandPayload(commandId, data)
      const message = encodeMessage(MessageType.COMMAND, payload)
      this.port.write(message)

      console.log("[v0] Command sent:", {
        commandId,
        message: message.toString("hex"),
      })

      return true
    } catch (err) {
      console.error("[v0] Failed to send command:", err)
      return false
    }
  }

  /**
   * Start heartbeat timer
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isConnected) return

      const now = Date.now()
      const timeSinceLastData = now - this.lastHeartbeat

      if (timeSinceLastData > 15000) {
        console.warn("[v0] No data received for 15s, connection may be lost")
        this.emit("connection-lost", { timeSinceLastData })
      }

      // Send heartbeat null packet
      console.log("[v0] Heartbeat sent")
    }, 10000)
  }

  /**
   * Stop heartbeat timer
   */
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any) {
    this.lastHeartbeat = Date.now()
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((cb) => cb(data))
    }
  }

  /**
   * Disconnect from port
   */
  disconnect() {
    this.stopHeartbeat()
    if (this.port) {
      this.port.close()
      this.port = null
    }
    this.isConnected = false
  }

  /**
   * Check if connected
   */
  isSerialConnected(): boolean {
    return this.isConnected
  }

  /**
   * Get list of available ports
   */
  static async listPorts(): Promise<string[]> {
    try {
      const ports = await SerialPort.list()
      return ports.map((p) => p.path)
    } catch (err) {
      console.error("[v0] Failed to list ports:", err)
      return []
    }
  }
}

// Singleton instance
let instance: SerialManager | null = null

export function getSerialManager(): SerialManager {
  if (!instance) {
    instance = new SerialManager()
  }
  return instance
}
