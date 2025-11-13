// components/app-viewer/media/YoutubeSidebar.tsx
"use client";

import React from "react";

interface SidebarProps {
  items: any[];
  onSelect: (id: string) => void;
}

export default function YoutubeSidebar({ items, onSelect }: SidebarProps) {
  return (
    <div className="overflow-auto h-full pr-2">
      <div className="mb-2 text-sm text-gray-400">Results</div>
      {items.length === 0 && <div className="text-gray-500">No results</div>}
      {items.map((it) => (
        <div key={String(it.id)} className="p-2 bg-gray-800 rounded mb-2 hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(it.id)}>
          <div className="font-semibold text-sm">{it.snippet?.title ?? "Untitled"}</div>
          <div className="text-xs text-gray-400">{it.snippet?.channelTitle ?? ""}</div>
        </div>
      ))}
    </div>
  );
}
