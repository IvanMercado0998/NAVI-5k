// electron/ipc-handlers.ts
// Do not change logic: Implement virtual keyboard fix only 

import { ipcMain, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { app, shell } from "electron";

const RECORDINGS_DIR = path.join(app.getPath("documents"), "TeslaInfotainment", "Recordings");

// Store reference to the main window for title updates
let mainWindow: BrowserWindow | null = null;

// Set the main window reference (call this from your main process)
export const setMainWindow = (window: BrowserWindow) => {
  mainWindow = window;
};

// Ensure recordings directory exists
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

export const setupIpcHandlers = () => {
  // File system handlers
  ipcMain.handle("fs:save-recording", async (_event, filename: string, buffer: Uint8Array) => {
    try {
      const filepath = path.join(RECORDINGS_DIR, filename);
      fs.writeFileSync(filepath, Buffer.from(buffer));
      return { success: true, path: filepath };
    } catch (error) {
      console.error("Failed to save recording:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });

  ipcMain.handle("fs:list-recordings", async () => {
    try {
      const files = fs.readdirSync(RECORDINGS_DIR);
      return files.map((file) => ({
        name: file,
        path: path.join(RECORDINGS_DIR, file),
        size: fs.statSync(path.join(RECORDINGS_DIR, file)).size,
      }));
    } catch (error) {
      console.error("Failed to list recordings:", error);
      return [];
    }
  });

  ipcMain.handle("fs:delete-recording", async (_event, filename: string) => {
    try {
      const filepath = path.join(RECORDINGS_DIR, filename);
      fs.unlinkSync(filepath);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete recording:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });

  // Window controls - Fixed to use proper BrowserWindow methods
  ipcMain.on("window:minimize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  });

  ipcMain.on("window:maximize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window?.isMaximized()) {
      window.unmaximize();
    } else {
      window?.maximize();
    }
  });

  ipcMain.on("window:close", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });

  // Window title synchronization handler
  ipcMain.on("window:set-title", (event, title: string) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.setTitle(title);

      // Also update the main window reference if available
      if (mainWindow) {
        mainWindow.setTitle(title);
      }
    }
  });

  // Header bar title update handler
  ipcMain.handle("window:update-header-title", async (_event, title: string) => {
    try {
      if (mainWindow) {
        // Update window title as well for consistency
        mainWindow.setTitle(title);

        // Broadcast to all webContents in the main window
        mainWindow.webContents.send("header-title-updated", title);
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to update header title:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });

  /* ------------------------------------------
      ✅ VIRTUAL KEYBOARD IPC HANDLERS (FIXED)
      IMPLEMENTATION NOTES:
      - Uses custom React virtual keyboard component
      - No Windows system calls needed
      - Better cross-platform compatibility
  ------------------------------------------- */

  // Virtual keyboard state management
  let virtualKeyboardVisible = false;

  // ✅ VIRTUAL KEYBOARD IPC Handlers
  ipcMain.handle("keyboard:openOSK", async () => {
    console.log("🎹 IPC: Showing virtual keyboard...");
    virtualKeyboardVisible = true;
    
    // Notify renderer to show virtual keyboard
    if (mainWindow) {
      mainWindow.webContents.send("virtual-keyboard:show");
    }
    
    return { success: true, method: "virtual-keyboard" };
  });

  ipcMain.handle("keyboard:closeOSK", async () => {
    console.log("🎹 IPC: Hiding virtual keyboard...");
    virtualKeyboardVisible = false;
    
    // Notify renderer to hide virtual keyboard
    if (mainWindow) {
      mainWindow.webContents.send("virtual-keyboard:hide");
    }
    
    return { success: true, message: "Virtual keyboard hidden" };
  });

  ipcMain.handle("keyboard:checkOSKStatus", async () => {
    return { 
      isRunning: virtualKeyboardVisible, 
      method: "virtual-keyboard",
      isVirtualKeyboard: true 
    };
  });

  // Additional virtual keyboard control
  ipcMain.handle("virtual-keyboard:toggle", async () => {
    virtualKeyboardVisible = !virtualKeyboardVisible;
    
    if (mainWindow) {
      mainWindow.webContents.send(
        virtualKeyboardVisible ? "virtual-keyboard:show" : "virtual-keyboard:hide"
      );
    }
    
    return { visible: virtualKeyboardVisible };
  });

  // Handle keyboard input from renderer (if needed)
  ipcMain.on("virtual-keyboard:input", (event, data) => {
    console.log("Virtual keyboard input received:", data);
    // You can handle special keyboard inputs here if needed
  });

  /* ------------------------------------------
      LEGACY WINDOWS OSK HANDLERS (KEPT FOR REFERENCE)
      Commented out since we're using virtual keyboard only
  ------------------------------------------- */

  /*
  const openWindowsOSK = async (): Promise<{ success: boolean; method?: string; error?: string }> => {
    if (process.platform === "win32") {
      const { exec } = require("child_process");
      try {
        // Method 1: Use shell.openExternal (most reliable)
        await shell.openExternal("osk.exe");
        return { success: true, method: "shell.openExternal" };
      } catch (error) {
        // Method 2: Fallback using exec
        return new Promise((resolve) => {
          exec("start osk", (err: any) => {
            if (err) {
              console.error("⚠️ OSK start failed:", err.message);
              resolve({ success: false, error: err.message });
            } else {
              resolve({ success: true, method: "exec:start" });
            }
          });
        });
      }
    } else {
      return { success: false, error: "OSK only supported on Windows" };
    }
  };

  const closeWindowsOSK = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (process.platform === "win32") {
      const { exec } = require("child_process");
      return new Promise((resolve) => {
        exec("taskkill /f /im osk.exe", (error: any) => {
          if (error) {
            if (error.message.includes("not found")) {
              resolve({ success: true, message: "OSK not running" });
            } else {
              resolve({ success: false, error: error.message });
            }
          } else {
            resolve({ success: true, message: "OSK closed successfully" });
          }
        });
      });
    } else {
      return { success: false, error: "OSK only supported on Windows" };
    }
  };

  // Legacy OSK handlers - commented out since we're using virtual keyboard
  ipcMain.handle("keyboard:openOSK-legacy", async () => {
    console.log("🔧 IPC: Opening Windows OSK (legacy)...");
    return await openWindowsOSK();
  });

  ipcMain.handle("keyboard:closeOSK-legacy", async () => {
    console.log("🔧 IPC: Closing Windows OSK (legacy)...");
    return await closeWindowsOSK();
  });

  ipcMain.handle("keyboard:checkOSKStatus-legacy", async () => {
    if (process.platform === "win32") {
      const { exec } = require("child_process");
      return new Promise((resolve) => {
        exec('tasklist /fi "imagename eq osk.exe"', (error: any, stdout: string) => {
          if (error) {
            resolve({ isRunning: false, error: error.message });
            return;
          }
          const isRunning = stdout.toLowerCase().includes("osk.exe");
          console.log("🔍 OSK Status Check:", { isRunning });
          resolve({ isRunning, processInfo: isRunning ? stdout : null });
        });
      });
    } else {
      return { isRunning: false, error: "OSK only supported on Windows" };
    }
  });
  */
};