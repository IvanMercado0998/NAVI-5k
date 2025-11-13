// components/app-viewer/media/YoutubePlayer.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import YoutubeSidebar from "./YoutubeSidebar";
import { fetchYoutubeMostPopular, searchYoutube } from "./useYoutube";

interface Props {
  apiKey?: string;
  appMode?: "youtube" | "youtube-music";
}

export default function YoutubePlayer({ apiKey, appMode = "youtube" }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      if (!apiKey) {
        setItems([]);
        return;
      }
      setLoading(true);
      const res = appMode === "youtube" ? await fetchYoutubeMostPopular(apiKey) : await searchYoutube(apiKey, "top music");
      setLoading(false);
      if (res?.items && Array.isArray(res.items)) {
        const mapped = appMode === "youtube" ? res.items.map((v: any) => ({ id: v.id, snippet: v.snippet })) : res.items.map((v: any) => ({ id: v.id.videoId, snippet: v.snippet }));
        setItems(mapped.filter((x) => x.id));
      } else {
        setItems([]);
      }
    })();
  }, [apiKey, appMode]);

  // load iframe API when needed
  const loadYT = () =>
    new Promise<void>((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) return resolve();
      (window as any).onYouTubeIframeAPIReady = () => resolve();
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.body.appendChild(s);
    });

  const createPlayer = async (videoId: string) => {
    await loadYT();
    if (!playerRef.current) return;
    if (player && player.loadVideoById) {
      player.loadVideoById(videoId);
      return;
    }
    const p = new (window as any).YT.Player(playerRef.current, { videoId, height: "360", width: "100%", playerVars: { autoplay: 1 } });
    setPlayer(p);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-full">
      <div className="col-span-1">
        <YoutubeSidebar items={items} onSelect={(id) => createPlayer(id)} />
      </div>

      <div className="col-span-2">
        <div className="bg-black rounded overflow-hidden h-[360px]">
          <div ref={playerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
