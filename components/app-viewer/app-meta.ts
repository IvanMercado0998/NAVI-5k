// components/app-viewer/app-meta.ts

export interface AppMeta {
  title: string;
  logoPath: string;   // ✅ replaced icon emoji with real PNG
  color: string;
  domain?: string;
}

/*
 ✅ PNG Logos Directory:
    public/logos/brave.png
    public/logos/googlemaps.png
    public/logos/spotify.png
    public/logos/youtube.png
    public/logos/YTMusic.png
*/

export const appMeta: Record<string, AppMeta> = {
  spotify: { 
    title: "Spotify",
    logoPath: "/logos/spotify.png",
    color: "from-green-600 to-black",
    domain: "spotify.com",
  },

  youtube: {
    title: "YouTube",
    logoPath: "/logos/youtube.png",
    color: "from-red-600 to-red-900",
    domain: "youtube.com",
  },

  "youtube-music": {
    title: "YouTube Music",
    logoPath: "/logos/YTMusic.png",
    color: "from-red-500 to-black",
    domain: "music.youtube.com",
  },

  maps: {
    title: "Navigation",
    logoPath: "/logos/googlemaps.png",
    color: "from-green-500 to-blue-500",
    domain: "google.com/maps",
  },

  brave: {
    title: "Brave Browser",
    logoPath: "/logos/brave.png",
    color: "from-orange-500 to-red-500",
    domain: "brave.com",
  },

  chrome: {
    title: "Chrome Browser",
    logoPath: "/logos/chrome.png", // ✅ (optional) you can add this PNG
    color: "from-blue-400 to-gray-600",
    domain: "google.com/chrome",
  },

  camera: {
    title: "Camera",
    logoPath: "", // no PNG logo → fallback is used
    color: "from-gray-500 to-gray-700",
  },

  controls: {
    title: "Controls",
    logoPath: "",
    color: "from-purple-500 to-purple-700",
  },

  settings: {
    title: "Settings",
    logoPath: "",
    color: "from-emerald-500 to-emerald-700",
  },
};


// ✅ Clean getter function (no React dependency)
export const getAppMeta = (appId: string): AppMeta => {
  return (
    appMeta[appId] || {
      title: "Unknown App",
      logoPath: "",
      color: "from-gray-500 to-gray-700"
    }
  );
};
