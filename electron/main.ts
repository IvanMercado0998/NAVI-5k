import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"
import * as isDev from "electron-is-dev"
import { getSerialManager } from "../lib/serial-manager"

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: path.join(__dirname, "../assets/icon.png"),
  })

  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../renderer/index.html")}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

const serialManager = getSerialManager()

app.on("ready", () => {
  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC Handlers for Serial Communication
ipcMain.handle("serial:list-ports", async () => {
  return await serialManager.constructor.listPorts()
})

ipcMain.handle("serial:connect", async (_event, portPath: string) => {
  return await serialManager.connect(portPath)
})

ipcMain.handle("serial:disconnect", async () => {
  serialManager.disconnect()
  return true
})

ipcMain.handle("serial:send", async (_event, data: string) => {
  return await serialManager.sendCommand(0, { data })
})

// Handle window state on close
ipcMain.on("app:quit", () => {
  serialManager.disconnect()
  app.quit()
})
