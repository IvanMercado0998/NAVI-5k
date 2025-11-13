// components/app-viewer/maps/useGraphhopper.ts
// Simple wrapper for GraphHopper via preload (ipc). All calls are defensive.

export async function ghSearch(query: string) {
  try {
    if (window.electronAPI?.graphhopper?.searchLocation) {
      return await window.electronAPI.graphhopper.searchLocation(query);
    } else {
      return null;
    }
  } catch (err) {
    console.error("ghSearch error", err);
    return null;
  }
}

export async function ghRoute(start: { lat: number; lng: number }, end: { lat: number; lng: number }) {
  try {
    if (window.electronAPI?.graphhopper?.route) {
      return await window.electronAPI.graphhopper.route(start, end);
    } else {
      return null;
    }
  } catch (err) {
    console.error("ghRoute error", err);
    return null;
  }
}
