// components/app-viewer/browser/useBrowser.ts
export function openBrave(url: string) {
  if (window.navi?.openBrowser) return window.navi.openBrowser(url);
  if (window.electronAPI?.browser?.open) return window.electronAPI.browser.open(url);
  window.open(url, "_blank");
}

export function browserBack() {
  if (window.electronAPI?.browser?.back) return window.electronAPI.browser.back();
}

export function browserForward() {
  if (window.electronAPI?.browser?.forward) return window.electronAPI.browser.forward();
}

export function browserReload() {
  if (window.electronAPI?.browser?.reload) return window.electronAPI.browser.reload();
}

