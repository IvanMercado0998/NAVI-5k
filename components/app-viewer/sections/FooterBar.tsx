// components/app-viewer/sections/FooterBar.tsx
"use client";

import React from "react";

interface FooterBarProps {
  theme: "light" | "dark";
}

export default function FooterBar({ theme }: FooterBarProps) {
  return (
    <div className="p-2 text-xs text-gray-400 bg-black/5 flex justify-between">
      <div>Theme: {theme}</div>
      <div>NAVI — {new Date().getFullYear()}</div>
    </div>
  );
}
