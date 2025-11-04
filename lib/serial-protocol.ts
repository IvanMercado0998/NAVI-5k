/**
 * Binary Serial Protocol Handler
 * Implements the protocol from the PDF specification with CRC and ACK handling
 */

export interface ProtocolMessage {
  header: number // 0xAA
  length: number
  type: MessageType
  payload: Buffer
  crc: number
  terminator: number // 0x0D
}

export enum MessageType {
  EVENT = 0x01,
  COMMAND = 0x02,
  ACK = 0x03,
}

export enum EventType {
  REVERSE_ON = 0x04,
  REVERSE_OFF = 0x05,
  TURN_LEFT_ON = 0x06,
  TURN_LEFT_OFF = 0x07,
  TURN_RIGHT_ON = 0x08,
  TURN_RIGHT_OFF = 0x09,
  ALARM_TRIP = 0x0a,
  LOW_BATT = 0x0b,
  IGNITION_ON = 0x0c,
  IGNITION_OFF = 0x0d,
}

export enum CommandType {
  SHUTDOWN = 0x01,
  SHUTDOWN_ACK = 0x02,
  KEEP_SENTRY = 0x03,
  DISABLE_SENTRY = 0x04,
  FORCE_POWER_OFF = 0x05,
}

/**
 * Calculate CRC8 checksum
 */
export function calculateCRC8(data: Buffer): number {
  let crc = 0
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]
    for (let j = 0; j < 8; j++) {
      if (crc & 0x80) {
        crc = (crc << 1) ^ 0x07
      } else {
        crc = crc << 1
      }
      crc &= 0xff
    }
  }
  return crc
}

/**
 * Encode message to binary format
 */
export function encodeMessage(type: MessageType, payload: Buffer): Buffer {
  const message = Buffer.alloc(payload.length + 5)
  message[0] = 0xaa // HEADER
  message[1] = payload.length // LEN
  message[2] = type // TYPE

  // Copy payload
  payload.copy(message, 3)

  // Calculate CRC
  const crcData = Buffer.concat([message.slice(1, 3), payload])
  message[3 + payload.length] = calculateCRC8(crcData)

  // Terminator
  message[4 + payload.length] = 0x0d // TERMINATOR

  return message
}

/**
 * Decode binary message
 */
export function decodeMessage(data: Buffer): ProtocolMessage | null {
  if (data.length < 6) return null
  if (data[0] !== 0xaa) return null
  if (data[data.length - 1] !== 0x0d) return null

  const length = data[1]
  const type = data[2]
  const payload = data.slice(3, 3 + length)
  const crc = data[3 + length]

  // Verify CRC
  const crcData = Buffer.concat([data.slice(1, 3), payload])
  const calculatedCrc = calculateCRC8(crcData)

  if (crc !== calculatedCrc) {
    console.error("[v0] CRC mismatch: expected", calculatedCrc, "got", crc)
    return null
  }

  return {
    header: 0xaa,
    length,
    type: type as MessageType,
    payload,
    crc,
    terminator: 0x0d,
  }
}

/**
 * Parse event payload
 */
export function parseEventPayload(eventId: number, payload: Buffer): Record<string, any> {
  const result: Record<string, any> = {
    eventId,
    timestamp: payload.readUInt32BE(0),
  }

  switch (eventId) {
    case EventType.LOW_BATT:
      // Format: 4 bytes timestamp, 2 bytes voltage (0.1V units)
      result.voltage = payload.readUInt16BE(4) * 0.1
      break
    case EventType.ALARM_TRIP:
      result.source = payload[4] === 1 ? "door_sensor" : "motion"
      break
  }

  return result
}

/**
 * Create event payload
 */
export function createEventPayload(eventId: number, timestamp: number, data?: Record<string, any>): Buffer {
  const buffer = Buffer.alloc(5 + (data ? 2 : 0))
  buffer[0] = eventId
  buffer.writeUInt32BE(timestamp, 1)

  if (data?.voltage !== undefined) {
    const voltageUnits = Math.round(data.voltage / 0.1)
    buffer.writeUInt16BE(voltageUnits, 5)
  }

  return buffer
}

/**
 * Create command payload
 */
export function createCommandPayload(commandId: number, data?: Record<string, any>): Buffer {
  const buffer = Buffer.alloc(1 + (data?.duration ? 4 : 0))
  buffer[0] = commandId

  if (data?.duration !== undefined) {
    buffer.writeUInt32BE(data.duration, 1)
  }

  return buffer
}
