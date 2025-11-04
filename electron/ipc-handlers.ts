import { ipcMain } from "electron"
import * as fs from "fs"
import * as path from "path"
import { app } from "electron"

const RECORDINGS_DIR = path.join(app.getPath("documents"), "TeslaInfotainment", "Recordings")

// Ensure recordings directory exists
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true })
}

export const setupIpcHandlers = () => {
  // File system handlers
  ipcMain.handle("fs:save-recording", async (_event, filename: string, buffer: Buffer) => {
    try {
      const filepath = path.join(RECORDINGS_DIR, filename)
      fs.writeFileSync(filepath, buffer)
      return { success: true, path: filepath }
    } catch (error) {
      console.error("Failed to save recording:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  })

  ipcMain.handle("fs:list-recordings", async () => {
    try {
      const files = fs.readdirSync(RECORDINGS_DIR)
      return files.map((file) => ({
        name: file,
        path: path.join(RECORDINGS_DIR, file),
        size: fs.statSync(path.join(RECORDINGS_DIR, file)).size,
      }))
    } catch (error) {
      console.error("Failed to list recordings:", error)
      return []
    }
  })

  ipcMain.handle("fs:delete-recording", async (_event, filename: string) => {
    try {
      const filepath = path.join(RECORDINGS_DIR, filename)
      fs.unlinkSync(filepath)
      return { success: true }
    } catch (error) {
      console.error("Failed to delete recording:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  })

  // Window controls
  ipcMain.on("window:minimize", (event) => {
    event.sender.getOwnerBrowserWindow()?.minimize()
  })

  ipcMain.on("window:maximize", (event) => {
    const window = event.sender.getOwnerBrowserWindow()
    if (window?.isMaximized()) {
      window.unmaximize()
    } else {
      window?.maximize()
    }
  })

  ipcMain.on("window:close", (event) => {
    event.sender.getOwnerBrowserWindow()?.close()
  })
}
