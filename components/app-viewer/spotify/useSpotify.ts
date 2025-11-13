// components/app-viewer/spotify/useSpotify.ts
// Lightweight wrapper for Spotify Web Playback SDK
export async function loadSpotifySDK() {
  if ((window as any).Spotify) return;
  const s = document.createElement("script");
  s.src = "https://sdk.scdn.co/spotify-player.js";
  s.async = true;
  await new Promise<void>((res, rej) => {
    s.onload = () => res();
    s.onerror = () => rej(new Error("Spotify SDK load failed"));
    document.body.appendChild(s);
  });
}
