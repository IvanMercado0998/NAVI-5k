"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)

  const tracks = [
    { id: 1, title: "Electric Dreams", artist: "Future Sound", duration: "3:45" },
    { id: 2, title: "Tesla Highway", artist: "Modern Beats", duration: "4:12" },
    { id: 3, title: "Autonomous", artist: "Digital Wave", duration: "3:28" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-8"
    >
      {/* Now Playing */}
      <div className="mb-8 pb-8 border-b border-border">
        <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">Now Playing</div>
        <div className="mb-4">
          <motion.div
            animate={{ scale: isPlaying ? 1.02 : 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-accent/10 to-black/40 rounded-lg w-full aspect-square mb-4 border border-accent/30 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                duration: isPlaying ? 3 : 0,
                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                ease: "linear",
              }}
              className="text-6xl text-accent"
            >
              ♪
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-bold text-foreground">Electric Dreams</h3>
          <p className="text-sm text-muted-foreground">Future Sound</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-border rounded-full overflow-hidden mb-2">
            <motion.div
              animate={{ width: isPlaying ? "2/3" : "1/3" }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1:15</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-col sm:flex-row gap-6">
          {/* Volume */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground uppercase font-bold">VOL</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number.parseInt(e.target.value))}
              className="flex-1 sm:w-32 h-1 bg-border rounded-full appearance-none cursor-pointer accent-accent"
            />
            <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
          </div>

          {/* Play Controls */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded border border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors flex items-center justify-center text-sm font-bold"
            >
              ⏮
            </motion.button>
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded border-2 border-accent bg-accent/10 hover:bg-accent/20 text-accent transition-all flex items-center justify-center font-bold"
            >
              {isPlaying ? "⏸" : "▶"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded border border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors flex items-center justify-center text-sm font-bold"
            >
              ⏭
            </motion.button>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div>
        <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Queue</div>
        <div className="space-y-2">
          {tracks.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="p-3 bg-background rounded border border-border hover:border-accent/50 cursor-pointer transition-smooth"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold text-foreground">{track.title}</div>
                  <div className="text-xs text-muted-foreground">{track.artist}</div>
                </div>
                <div className="text-xs text-muted-foreground">{track.duration}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
