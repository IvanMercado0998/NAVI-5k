// components/app-viewer/spotify/SpotifyPlayer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { loadSpotifySDK } from "./useSpotify";
import { Play, Pause } from "lucide-react";

interface Props {
  token?: string;
}

export default function SpotifyPlayer({ token }: Props) {
  const [player, setPlayer] = useState<any | null>(null);
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Spotify token missing");
      return;
    }
    let mounted = true;
    (async () => {
      try {
        await loadSpotifySDK();
        const Player = window.Spotify?.Player;
        if (!Player) {
          setError("Spotify Player not available");
          return;
        }
        const p = new Player({
          name: "NAVi Spotify Player",
          getOAuthToken: (cb: (t: string) => void) => cb(token),
        });

        p.addListener("player_state_changed", (s: any) => {
          if (!mounted) return;
          if (!s) {
            setIsPlaying(false);
            return;
          }
          setIsPlaying(!s.paused);
        });

        p.addListener("ready", () => {
          if (!mounted) return;
          setReady(true);
        });

        await p.connect();
        setPlayer(p);
      } catch (err) {
        console.error("spotify init", err);
        setError(String(err));
      }
    })();
    return () => {
      mounted = false;
      try {
        player?.disconnect?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggle = async () => {
    try {
      if (!player) return;
      const state = await player.getCurrentState();
      if (!state) return;
      if (state.paused) await player.resume();
      else await player.pause();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {error && <div className="p-3 bg-red-700 rounded mb-3">{error}</div>}
      {!ready && !error && <div>Loading Spotify...</div>}
      {ready && (
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="px-3 py-2 bg-white/10 rounded">
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <div>
            <div className="font-bold">Spotify Player</div>
            <div className="text-sm text-gray-300">Use your Spotify app to play/transfer.</div>
          </div>
        </div>
      )}
    </div>
  );
}
