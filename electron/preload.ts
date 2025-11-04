import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
  // Serial communication
  serial: {
    listPorts: () => ipcRenderer.invoke("serial:list-ports"),
    connect: (portPath: string) => ipcRenderer.invoke("serial:connect", portPath),
    disconnect: () => ipcRenderer.invoke("serial:disconnect"),
    send: (data: string) => ipcRenderer.invoke("serial:send", data),
    onData: (callback: (data: string) => void) => {
      ipcRenderer.on("serial:data", (_event, data) => callback(data))
    },
  },

  // File system operations
  fs: {
    saveRecording: (path: string, buffer: Buffer) => ipcRenderer.invoke("fs:save-recording", path, buffer),
    listRecordings: () => ipcRenderer.invoke("fs:list-recordings"),
    deleteRecording: (path: string) => ipcRenderer.invoke("fs:delete-recording", path),
  },

  // App controls
  app: {
    quit: () => ipcRenderer.send("app:quit"),
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
  },
})

declare global {
  interface Window {
    electronAPI: {
      serial: {
        listPorts: () => Promise<string[]>
        connect: (portPath: string) => Promise<boolean>
        disconnect: () => Promise<boolean>
        send: (data: string) => Promise<boolean>
        onData: (callback: (data: string) => void) => void
      }
      fs: {
        saveRecording: (path: string, buffer: Buffer) => Promise<boolean>
        listRecordings: () => Promise<string[]>
        deleteRecording: (path: string) => Promise<boolean>
      }
      app: {
        quit: () => void
        minimize: () => void
        maximize: () => void
        close: () => void
      }
    }
  }
}
