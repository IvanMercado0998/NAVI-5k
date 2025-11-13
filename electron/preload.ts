// electron/preload.ts
/**
 * NAVI Infotainment System - Electron Preload Script
 * 
 * @description
 * Secure bridge between the Electron main process and renderer process.
 * Exposes a controlled API to the frontend React application while maintaining
 * security through context isolation. Handles all IPC communication for
 * system integration, virtual keyboard control, and external services.
 * 
 * @author Ivan Mercado
 * @version 2.0.0
 * 
 * @features
 * - Secure context isolation between main and renderer processes
 * - Type-safe IPC communication channels
 * - Virtual keyboard state management
 * - Serial port communication interface
 * - File system operations for media storage
 * - Browser view control for web content
 * - GraphHopper navigation services integration
 * - Whisper speech-to-text transcription
 * - Application lifecycle management
 * 
 * @security
 * - Context isolation prevents direct Node.js access from renderer
 * - Filtered API exposure limits frontend capabilities
 * - IPC channel validation and sanitization
 * - No nodeIntegration in renderer process
 * 
 * @ipc-channels
 * - keyboard: Virtual keyboard show/hide/status control
 * - serial: Serial port communication and device management
 * - fs: File system operations for recordings and media
 * - browser: Brave browser view navigation and control
 * - graphhopper: Navigation and geocoding services
 * - whisper: Speech-to-text transcription services
 * - app: Application lifecycle management
 * 
 * @usage
 * Accessible via window.electronAPI in renderer process:
 * window.electronAPI.keyboard.openOSK()
 * window.electronAPI.serial.listPorts()
 * window.electronAPI.fs.saveRecording(filename, buffer)
 */

import { contextBridge, ipcRenderer } from "electron";
import { Buffer } from "buffer";

// Secure API bridge between main and renderer processes
contextBridge.exposeInMainWorld("electronAPI", {
  // ✅ VIRTUAL KEYBOARD API — Custom React keyboard implementation
  keyboard: {
    /**
     * Opens the custom virtual keyboard
     * @returns Promise with operation status
     */
    openOSK: () => ipcRenderer.invoke("keyboard:openOSK"),
    
    /**
     * Closes the custom virtual keyboard
     * @returns Promise with operation status
     */
    closeOSK: () => ipcRenderer.invoke("keyboard:closeOSK"),
    
    /**
     * Checks current virtual keyboard status
     * @returns Promise with visibility state and method info
     */
    checkOSKStatus: () => ipcRenderer.invoke("keyboard:checkOSKStatus"),
    
    /**
     * Listens for virtual keyboard show events from main process
     * @param callback Function to execute when keyboard should show
     */
    onVirtualKeyboardShow: (callback: () => void) => 
      ipcRenderer.on("virtual-keyboard:show", callback),
    
    /**
     * Listens for virtual keyboard hide events from main process
     * @param callback Function to execute when keyboard should hide
     */
    onVirtualKeyboardHide: (callback: () => void) => 
      ipcRenderer.on("virtual-keyboard:hide", callback),
  },

  // ✅ SERIAL COMMUNICATION API — Hardware device communication
  serial: {
    /**
     * Lists available serial ports
     * @returns Promise with array of available ports
     */
    listPorts: () => ipcRenderer.invoke("serial:list-ports"),
    
    /**
     * Connects to a specific serial port
     * @param path Serial port path to connect to
     * @returns Promise with connection status
     */
    connect: (path: string) => ipcRenderer.invoke("serial:connect", path),
    
    /**
     * Disconnects from current serial port
     * @returns Promise with disconnection status
     */
    disconnect: () => ipcRenderer.invoke("serial:disconnect"),
    
    /**
     * Sends data to connected serial device
     * @param data String data to send to serial device
     * @returns Promise with transmission status
     */
    send: (data: string) => ipcRenderer.invoke("serial:send", data),
    
    /**
     * Listens for incoming serial data
     * @param cb Callback function to handle received data
     */
    onData: (cb: (data: string) => void) =>
      ipcRenderer.on("serial:data", (_, d) => cb(d)),
  },

  // ✅ FILE SYSTEM API — Media storage and management
  fs: {
    /**
     * Saves audio recording to file system
     * @param filename Name for the recording file
     * @param buffer Audio data buffer to save
     * @returns Promise with save operation status and file path
     */
    saveRecording: (filename: string, buffer: Buffer) =>
      ipcRenderer.invoke("fs:save-recording", filename, buffer),
  },

  // ✅ BROWSER CONTROL API — Brave browser view management
  browser: {
    /**
     * Opens URL in embedded Brave browser view
     * @param url Web address to load in browser
     */
    open: (url: string) => ipcRenderer.send("browser:open", url),
    
    /**
     * Navigates browser view back in history
     */
    back: () => ipcRenderer.send("browser:back"),
    
    /**
     * Navigates browser view forward in history
     */
    forward: () => ipcRenderer.send("browser:forward"),
    
    /**
     * Reloads current browser view page
     */
    reload: () => ipcRenderer.send("browser:reload"),
    
    /**
     * Closes and removes browser view
     */
    close: () => ipcRenderer.send("browser:close"),
  },

  // ✅ NAVIGATION SERVICES API — GraphHopper integration
  graphhopper: {
    /**
     * Searches for locations using GraphHopper geocoding
     * @param q Search query string
     * @returns Promise with search results
     */
    searchLocation: (q: string) =>
      ipcRenderer.invoke("graphhopper:search", q),
    
    /**
     * Calculates route between two points
     * @param s Start coordinates {lat, lng}
     * @param e End coordinates {lat, lng}
     * @returns Promise with route information
     */
    route: (s: any, e: any) => ipcRenderer.invoke("graphhopper:route", s, e),
  },

  // ✅ SPEECH-TO-TEXT API — Whisper transcription services
  whisper: {
    /**
     * Transcribes audio file to text using Whisper
     * @param file Path to audio file for transcription
     * @returns Promise with transcribed text
     */
    transcribe: (file: string) => ipcRenderer.invoke("whisper:transcribe", file),
  },

  // ✅ APPLICATION CONTROL API — System lifecycle management
  app: {
    /**
     * Gracefully quits the application
     * @returns Promise with quit status
     */
    quit: () => ipcRenderer.invoke("app:quit"),
    
    /**
     * Restarts the application
     * @returns Promise with restart status
     */
    restart: () => ipcRenderer.invoke("app:restart"),
  },
});