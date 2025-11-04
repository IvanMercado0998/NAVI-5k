/**
 * API Route for Serial Communication
 * Provides REST endpoints for serial operations
 */

import { type NextRequest, NextResponse } from "next/server"
import { getSerialManager } from "@/lib/serial-manager"
import { CommandType } from "@/lib/serial-protocol"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, port = "COM3", command, data } = body

    const serialManager = getSerialManager()

    switch (action) {
      case "connect":
        const connected = await serialManager.connect(port)
        return NextResponse.json({ success: connected })

      case "disconnect":
        serialManager.disconnect()
        return NextResponse.json({ success: true })

      case "status":
        return NextResponse.json({
          connected: serialManager.isSerialConnected(),
        })

      case "send-command":
        let commandId = 0
        switch (command) {
          case "SHUTDOWN":
            commandId = CommandType.SHUTDOWN
            break
          case "SHUTDOWN_ACK":
            commandId = CommandType.SHUTDOWN_ACK
            break
          case "KEEP_SENTRY":
            commandId = CommandType.KEEP_SENTRY
            break
          case "DISABLE_SENTRY":
            commandId = CommandType.DISABLE_SENTRY
            break
          case "FORCE_POWER_OFF":
            commandId = CommandType.FORCE_POWER_OFF
            break
        }

        const sent = await serialManager.sendCommand(commandId, data)
        return NextResponse.json({ success: sent })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (err) {
    console.error("[v0] Serial API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    const serialManager = getSerialManager()

    switch (action) {
      case "list-ports":
        const ports = await getSerialManager().constructor["listPorts"]?.()
        return NextResponse.json({ ports: ports || [] })

      case "status":
        return NextResponse.json({
          connected: serialManager.isSerialConnected(),
        })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (err) {
    console.error("[v0] Serial API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
