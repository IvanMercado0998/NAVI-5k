// components/app-viewer/browser/BrowserControls.tsx
"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { openBrave, browserBack, browserForward, browserReload } from "./useBrowser";

interface Props {
  openBrowser?: (url: string) => void;
}

export default function BrowserControls({ openBrowser: openFromProps }: Props) {
  const open = (u: string) => {
    if (openFromProps) return openFromProps(u);
    openBrave(u);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
      <div className="text-lg font-semibold">Brave Browser (BrowserView)</div>

      <div className="flex gap-2">
        <button onClick={() => open("https://search.brave.com")} className="px-4 py-2 bg-white/10 rounded">
          Brave Search
        </button>
        <button onClick={() => open("https://brave.com")} className="px-4 py-2 bg-white/10 rounded">
          Brave Home
        </button>
        <button onClick={() => browserBack()} className="px-3 py-2 bg-white/10 rounded">
          Back
        </button>
        <button onClick={() => browserForward()} className="px-3 py-2 bg-white/10 rounded">
          Forward
        </button>
        <button onClick={() => browserReload()} className="px-3 py-2 bg-white/10 rounded">
          <RefreshCw />
        </button>
      </div>
      <div className="text-sm text-gray-400 mt-2">Opens a native BrowserView inside Electron (preload + main handlers required).</div>
    </div>
  );
}
