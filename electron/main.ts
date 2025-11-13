/**
 * NAVI Infotainment System - Electron Main Process
 * 
 * @description
 * Main process entry point for the NAVI automotive infotainment system.
 * Uses custom virtual keyboard instead of Windows OSK for better reliability.
 * 
 * @author Ivan Mercado
 * @version 2.1.0
 */

import { app, BrowserWindow, ipcMain, BrowserView } from "electron";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import { setupIpcHandlers } from "./ipc-handlers";

let mainWindow: BrowserWindow | null = null;
let braveView: BrowserView | null = null;

// ✅ GraphHopper API Key
const GH_KEY = process.env.GRAPHHOPPER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ Create Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ??
      `file://${path.join(__dirname, "../renderer/index.html")}`
  );

  setupVirtualKeyboardHandlers();
};

// ✅ App Ready
app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ✅ Quit Handler
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* ------------------------------------------
    ✅ VIRTUAL KEYBOARD HANDLERS
------------------------------------------- */

let virtualKeyboardVisible = false;

const setupVirtualKeyboardHandlers = () => {
  if (!mainWindow) return;

  ipcMain.handle("keyboard:openOSK", async () => {
    console.log("🎹 IPC: Showing virtual keyboard...");
    virtualKeyboardVisible = true;
    mainWindow?.webContents.send("virtual-keyboard:show");
    return { success: true, method: "virtual-keyboard" };
  });

  ipcMain.handle("keyboard:closeOSK", async () => {
    console.log("🎹 IPC: Hiding virtual keyboard...");
    virtualKeyboardVisible = false;
    mainWindow?.webContents.send("virtual-keyboard:hide");
    return { success: true, message: "Virtual keyboard hidden" };
  });

  ipcMain.handle("keyboard:checkOSKStatus", async () => ({
    isRunning: virtualKeyboardVisible,
    method: "virtual-keyboard",
    isVirtualKeyboard: true,
  }));

  ipcMain.handle("virtual-keyboard:toggle", async () => {
    virtualKeyboardVisible = !virtualKeyboardVisible;
    mainWindow?.webContents.send(
      virtualKeyboardVisible ? "virtual-keyboard:show" : "virtual-keyboard:hide"
    );
    return { visible: virtualKeyboardVisible };
  });

  ipcMain.on("virtual-keyboard:input", (_, data) => {
    console.log("Virtual keyboard input received:", data);
  });
};

/* ------------------------------------------
    ✅ SERIAL PLACEHOLDER
------------------------------------------- */
ipcMain.handle("serial:list-ports", async () => {
  console.log("Serial: list-ports called");
  return [];
});

ipcMain.handle("serial:connect", async (_, path: string) => {
  console.log("Serial: connect called with path:", path);
  return { success: true };
});

ipcMain.handle("serial:disconnect", async () => {
  console.log("Serial: disconnect called");
  return { success: true };
});

ipcMain.handle("serial:send", async (_, data: string) => {
  console.log("Serial: send called with data:", data);
  return { success: true };
});

/* ------------------------------------------
    ✅ BRAVE BROWSER VIEW
------------------------------------------- */
ipcMain.on("browser:open", (_, url: string) => {
  if (!mainWindow) return;

  if (!braveView) {
    braveView = new BrowserView({
      webPreferences: { nodeIntegration: false, contextIsolation: true },
    });
    mainWindow.setBrowserView(braveView);
  }

  braveView.webContents.loadURL(url);

  const resize = () => {
    if (!mainWindow || !braveView) return;
    const { width, height } = mainWindow.getContentBounds();
    braveView.setBounds({ x: 0, y: 90, width, height: height - 90 });
  };

  resize();
  mainWindow.on("resize", resize);
});

ipcMain.on("browser:close", () => {
  if (braveView && mainWindow) {
    mainWindow.setBrowserView(null);
    braveView = null;
  }
});

ipcMain.on("browser:back", () => braveView?.webContents.goBack());
ipcMain.on("browser:forward", () => braveView?.webContents.goForward());
ipcMain.on("browser:reload", () => braveView?.webContents.reload());

/* ------------------------------------------
    ✅ GRAPHHOPPER HANDLERS
------------------------------------------- */
ipcMain.handle("graphhopper:search", async (_, q: string) => {
  if (!GH_KEY) return { error: "GraphHopper API key not configured" };
  const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(q)}&key=${GH_KEY}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("GraphHopper search error:", err);
    return { error: "Search failed" };
  }
});

ipcMain.handle("graphhopper:route", async (_, start: any, end: any) => {
  if (!GH_KEY) return { error: "GraphHopper API key not configured" };
  const url = `https://graphhopper.com/api/1/route?point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&vehicle=car&key=${GH_KEY}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("GraphHopper route error:", err);
    return { error: "Route failed" };
  }
});

/* ------------------------------------------
    ✅ FILE SYSTEM HANDLER (recordings)
------------------------------------------- */
ipcMain.handle("fs:save-recording", async (_, filename: string, buffer: Buffer) => {
  try {
    const recordingsDir = path.join(app.getPath("userData"), "recordings");
    if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir, { recursive: true });

    const fullPath = path.join(recordingsDir, filename);
    fs.writeFileSync(fullPath, buffer);
    console.log("🎤 Saved recording:", fullPath);

    return { success: true, path: fullPath };
  } catch (err) {
    console.error("Error saving recording:", err);
    return { success: false, error: err };
  }
});

/* ------------------------------------------
    ✅ OPENAI WHISPER STT INTEGRATION
------------------------------------------- */
ipcMain.handle("whisper:transcribe", async (_, filePath: string) => {
  try {
    if (!OPENAI_API_KEY) {
      console.error("❌ Missing OPENAI_API_KEY environment variable");
      return { error: "Missing OpenAI API key" };
    }

    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(app.getPath("userData"), "recordings", filePath);

    if (!fs.existsSync(resolvedPath)) {
      console.error("❌ File not found:", resolvedPath);
      return { error: "Audio file not found" };
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(resolvedPath));
    formData.append("model", "whisper-1");

    console.log("🎙️ Transcribing:", resolvedPath);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: formData as any,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Whisper API error:", errText);
      return { error: errText };
    }

    const data = await response.json();
    console.log("✅ Whisper result:", data.text);
    return { text: data.text };
  } catch (err) {
    console.error("Whisper error:", err);
    return { error: String(err) };
  }
});

/* ------------------------------------------
    ✅ SYSTEM INFO
------------------------------------------- */
ipcMain.handle("system:info", async () => ({
  platform: process.platform,
  arch: process.arch,
  version: process.version,
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  node: process.versions.node,
}));
