// components/app-viewer/types.d.ts
// DO NOT CHANGE LOGIC IN THIS FILE
// Implement OSK fix only 
export {};

declare global {
  interface ElectronGraphHopper {
    searchLocation?: (q: string) => Promise<any>;
    reverseGeocode?: (lat: number, lng: number) => Promise<any>;
    route?: (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => Promise<any>;
  }

  interface ElectronFS {
    saveRecording?: (path: string, buffer: Buffer) => Promise<boolean>;
    listRecordings?: () => Promise<string[]>;
    deleteRecording?: (path: string) => Promise<boolean>;
  }

  // ADD KEYBOARD INTERFACE
  interface ElectronKeyboard {
    openOSK?: () => Promise<{ success: boolean }>;
    closeOSK?: () => Promise<{ success: boolean }>;
  }

  interface ElectronAPI {
    graphhopper?: ElectronGraphHopper;
    fs?: ElectronFS;
    whisperTranscribe?: (filePath: string) => Promise<any>;
    browser?: { open?: (url: string) => void; back?: () => void; forward?: () => void; reload?: () => void };
    serial?: any;
    app?: any;
    // ADD KEYBOARD PROPERTY
    keyboard?: ElectronKeyboard;
  }

  interface Window {
    electronAPI?: ElectronAPI;
    navi?: { openBrowser: (url: string) => void };
    L?: any;
    YT?: any;
  }
}