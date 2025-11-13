// components/app-launcher.tsx
"use client"

import { motion } from "framer-motion"
import { X, RefreshCw, ArrowLeft, ArrowRight, Home, Search } from "lucide-react"
import { useState, useEffect } from "react"

interface AppLauncherProps {
  app: string
  onClose: () => void
  onBrowserAction?: (action: string, data?: any) => void
}

interface AppData {
  title: string
  color: string
  domain?: string
  content: React.ReactNode
}

export default function AppLauncher({ app, onClose, onBrowserAction }: AppLauncherProps) {
  const [appIcons, setAppIcons] = useState<Record<string, string>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [currentUrl, setCurrentUrl] = useState("https://search.brave.com")
  const [browserHistory, setBrowserHistory] = useState<string[]>(["https://search.brave.com"])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Browser navigation functions
  const navigateTo = (url: string) => {
    const newHistory = browserHistory.slice(0, historyIndex + 1)
    newHistory.push(url)
    setBrowserHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentUrl(url)
    onBrowserAction?.('navigate', { url })
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentUrl(browserHistory[historyIndex - 1])
      onBrowserAction?.('back')
    }
  }

  const goForward = () => {
    if (historyIndex < browserHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentUrl(browserHistory[historyIndex + 1])
      onBrowserAction?.('forward')
    }
  }

  const reload = () => {
    onBrowserAction?.('reload')
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = e.currentTarget.querySelector('input') as HTMLInputElement
    if (input.value) {
      let url = input.value
      if (!url.startsWith('http')) {
        url = 'https://' + url
      }
      navigateTo(url)
    }
  }

  const apps: Record<string, AppData> = {
    youtube: {
      title: "YouTube",
      color: "from-red-600 to-red-700",
      domain: "youtube.com",
      content: (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img 
                src={appIcons.youtube} 
                alt="YouTube"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="text-6xl hidden">▶</div>
            </div>
            <p className="text-xl text-gray-400">YouTube Video Player</p>
            <p className="text-sm text-gray-600 mt-2">Connected via vehicle system</p>
            <div className="mt-8 w-full aspect-video bg-gray-900 rounded-lg border-2 border-gray-700" />
          </div>
        </div>
      ),
    },
    brave: {
      title: "Brave Browser",
      color: "from-orange-500 to-red-500",
      domain: "brave.com",
      content: (
        <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
          {/* Browser Toolbar */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={goBack}
                disabled={historyIndex === 0}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={goForward}
                disabled={historyIndex === browserHistory.length - 1}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowRight size={18} />
              </button>
              <button
                onClick={reload}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={() => navigateTo("https://search.brave.com")}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Home size={18} />
              </button>
            </div>

            {/* Address Bar */}
            <form onSubmit={handleUrlSubmit} className="flex-1 flex">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-orange-500"
                placeholder="Enter website address..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Browser Content */}
          <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4">
            {currentUrl.includes('brave.com') || currentUrl.includes('search.brave.com') ? (
              <div className="text-center max-w-md">
                <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src={appIcons.brave} 
                    alt="Brave Browser"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="text-6xl hidden">🦁</div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Brave Browser
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Fast, secure, and private web browser
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Ready to browse securely with built-in privacy protection.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌐</div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Loading {currentUrl}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Secure browsing with Brave
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Access Links */}
          <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex gap-4 justify-center">
              {[
                { name: "Brave Search", url: "https://search.brave.com" },
                { name: "Google", url: "https://google.com" },
                { name: "YouTube", url: "https://youtube.com" },
                { name: "Maps", url: "https://maps.google.com" }
              ].map((site) => (
                <button
                  key={site.name}
                  onClick={() => navigateTo(site.url)}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {site.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    maps: {
      title: "Google Maps",
      color: "from-green-500 to-blue-500",
      domain: "google.com",
      content: (
        <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src={appIcons.maps} 
                  alt="Google Maps"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <span className="text-lg hidden">🗺</span>
              </div>
              <input
                type="text"
                placeholder="Search location..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600"
              />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src={appIcons.maps} 
                  alt="Google Maps"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <span className="text-6xl hidden">🗺</span>
              </div>
              <p className="text-lg">Google Maps Navigation</p>
              <p className="text-sm text-gray-500 mt-2">Real-time Navigation & Routing</p>
            </div>
          </div>
        </div>
      ),
    },
    // ... other apps (camera, spotify, youtube-music) remain the same
    camera: {
      title: "Camera",
      color: "from-blue-500 to-purple-500",
      content: (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
              <div className="text-center z-10">
                <div className="text-6xl mb-4 animate-pulse">📷</div>
                <p className="text-lg text-gray-300">Camera View</p>
                <p className="text-sm text-gray-600 mt-2">Multi-camera System Active</p>
              </div>
              <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
                {["Front", "Rear", "Left", "Right"].map((cam, i) => (
                  <div
                    key={cam}
                    className="bg-gray-900 rounded-lg border-2 border-gray-700 flex items-center justify-center text-gray-600"
                  >
                    {cam}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    spotify: {
      title: "Spotify",
      color: "from-green-600 to-black",
      domain: "spotify.com",
      content: (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900 to-black">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img 
                src={appIcons.spotify} 
                alt="Spotify"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="text-6xl hidden">🎵</div>
            </div>
            <p className="text-xl text-gray-400">Spotify Music</p>
            <p className="text-sm text-gray-600 mt-2">Streaming your favorite music</p>
            <div className="mt-8 w-64 h-64 bg-green-900 rounded-lg border-2 border-green-700 flex items-center justify-center">
              <div className="text-green-400 text-lg">Now Playing</div>
            </div>
          </div>
        </div>
      ),
    },
    "youtube-music": {
      title: "YouTube Music",
      color: "from-red-500 to-black",
      domain: "youtube.com",
      content: (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900 to-black">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img 
                src={appIcons["youtube-music"]} 
                alt="YouTube Music"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="text-6xl hidden">♫</div>
            </div>
            <p className="text-xl text-gray-400">YouTube Music</p>
            <p className="text-sm text-gray-600 mt-2">Music streaming service</p>
            <div className="mt-8 w-64 h-64 bg-red-900 rounded-lg border-2 border-red-700 flex items-center justify-center">
              <div className="text-red-400 text-lg">Playlist</div>
            </div>
          </div>
        </div>
      ),
    },
  }

  // Fetch Clearbit icons
  useEffect(() => {
    const fetchIcons = async () => {
      const newIcons: Record<string, string> = {}
      const newLoadingStates: Record<string, boolean> = {}

      for (const [appKey, appData] of Object.entries(apps)) {
        if (appData.domain) {
          newLoadingStates[appKey] = true
          try {
            const clearbitUrl = `https://logo.clearbit.com/${appData.domain}?size=128`
            const response = await fetch(clearbitUrl)
            if (response.ok) {
              newIcons[appKey] = clearbitUrl
            }
          } catch (error) {
            console.warn(`Failed to fetch icon for ${appData.title}:`, error)
          } finally {
            newLoadingStates[appKey] = false
          }
        }
      }

      setAppIcons(newIcons)
      setLoadingStates(newLoadingStates)
    }

    fetchIcons()
  }, [])

  const selectedApp = apps[app as keyof typeof apps]

  if (!selectedApp) return null

  // Get fallback icon for header
  const getFallbackIcon = (appId: string) => {
    const fallbackIcons: Record<string, string> = {
      "youtube": "▶",
      "brave": "🦁",
      "maps": "🗺",
      "camera": "📷",
      "spotify": "🎵",
      "youtube-music": "♫",
    }
    return fallbackIcons[appId] || "🚗"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedApp.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            {appIcons[app] ? (
              <img 
                src={appIcons[app]} 
                alt={selectedApp.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <span className={`text-2xl ${appIcons[app] ? 'hidden' : ''}`}>
              {getFallbackIcon(app)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{selectedApp.title}</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-auto"
      >
        {selectedApp.content}
      </motion.div>
    </motion.div>
  )
}