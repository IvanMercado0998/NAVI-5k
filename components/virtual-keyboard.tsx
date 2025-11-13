//components\virtual-keyboard.tsx
// split screen should be left side not bottom 
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VirtualKeyboardProps {
  visible: boolean
  onInput: (value: string) => void
  onClose: () => void
  position?: 'bottom' | 'split'
  onTogglePosition?: () => void
}

export default function VirtualKeyboard({ 
  visible, 
  onInput, 
  onClose, 
  position = 'bottom',
  onTogglePosition 
}: VirtualKeyboardProps) {
  const [shift, setShift] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const keyboardRef = useRef<HTMLDivElement>(null)

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '⌫'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?'],
    ['🌐', 'space', 'return']
  ]

  // Handle escape key to close keyboard
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        onClose()
      }
    }

    if (visible) {
      document.addEventListener("keydown", handleEscape)
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [visible, onClose])

  // Prevent accidental closing when clicking inside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [visible])

  const handleKeyPress = (key: string) => {
    switch (key) {
      case '⌫':
        onInput('Backspace')
        break
      case '⇧':
        if (capsLock) {
          setCapsLock(false)
          setShift(false)
        } else {
          setShift(!shift)
          if (shift) setCapsLock(true)
        }
        break
      case 'space':
        onInput(' ')
        break
      case 'return':
        onInput('\n') // Send newline character for textareas
        onInput('Enter') // Also send Enter for form submission
        break
      case '🌐':
        console.log("Language switcher clicked")
        break
      default:
        const output = capsLock ? key.toUpperCase() : (shift ? key.toUpperCase() : key)
        onInput(output)
        if (shift && !capsLock) setShift(false)
    }
  }

  const toggleMinimize = () => setIsMinimized(!isMinimized)

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Semi-transparent overlay for split screen mode only */}
        {position === 'split' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black pointer-events-auto"
            onClick={onClose}
          />
        )}
        
        {/* Keyboard container */}
        <motion.div
          ref={keyboardRef}
          initial={{ 
            y: position === 'bottom' ? 400 : 200,
            opacity: 0 
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            height: position === 'split' ? '50vh' : 'auto'
          }}
          exit={{ 
            y: position === 'bottom' ? 400 : 200, 
            opacity: 0 
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`
            absolute left-0 right-0 mx-auto pointer-events-auto
            ${position === 'split' 
              ? 'bottom-0 h-1/2' 
              : 'bottom-0'
            }
          `}
        >
          <div
            className={`
              flex flex-col w-full
              ${isMinimized ? "h-16" : position === 'split' ? "h-full" : "h-[320px] sm:h-[360px]"}
              bg-[rgba(245,245,247,0.95)] dark:bg-[rgba(22,22,22,0.95)]
              backdrop-blur-2xl border-t border-gray-300/30 dark:border-gray-700/30
              shadow-[0_-10px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.6)]
              transition-all duration-300
              ${position === 'split' ? 'rounded-t-2xl' : ''}
            `}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300/40 dark:border-gray-700/40">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-800 dark:text-gray-300 text-sm font-medium select-none">
                  Virtual Keyboard {position === 'split' ? '(Split Screen)' : ''}
                </span>
                {/* State indicators */}
                {(shift || capsLock) && (
                  <div className="flex gap-1">
                    {capsLock && <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">CAPS</span>}
                    {shift && !capsLock && <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">SHIFT</span>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Split screen toggle button */}
                {onTogglePosition && (
                  <button
                    onClick={onTogglePosition}
                    className="p-2 rounded-lg hover:bg-gray-300/40 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400"
                    title={`Switch to ${position === 'bottom' ? 'split screen' : 'bottom'}`}
                  >
                    {position === 'bottom' ? '↗' : '↙'}
                  </button>
                )}
                
                <button
                  onClick={toggleMinimize}
                  className="p-2 rounded-lg hover:bg-gray-300/40 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMinimized
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />}
                  </svg>
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-300/40 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main keyboard layout */}
            {!isMinimized && (
              <div className="flex flex-col justify-center items-center w-full h-full p-3 sm:p-4">
                <div className="flex flex-col w-full max-w-6xl mx-auto gap-2 sm:gap-3">
                  {rows.map((row, i) => (
                    <div key={i} className="flex justify-center gap-[0.25rem] sm:gap-2">
                      {row.map((key) => {
                        const isSpecial = ['⌫', '⇧', 'space', 'return', '🌐'].includes(key)
                        const isActive = key === '⇧' && (shift || capsLock)

                        return (
                          <motion.button
                            key={`${i}-${key}`}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => handleKeyPress(key)}
                            className={`
                              flex items-center justify-center rounded-xl select-none
                              text-[0.8rem] sm:text-base font-medium
                              transition-all duration-200 border border-gray-400/30 dark:border-gray-700/40
                              ${isSpecial
                                ? "bg-gray-300/60 dark:bg-gray-700/60 hover:bg-gray-400/60 dark:hover:bg-gray-600/60"
                                : "bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300/60 dark:hover:bg-gray-700/60"}
                              ${isActive ? "bg-gray-500/70 dark:bg-gray-600/70 border-gray-500" : ""}
                              ${key === 'space' ? "flex-[3_1_20%] min-h-12" : "flex-[1_1_6%] min-h-12 sm:min-h-14"}
                              ${key === 'return' ? "flex-[1.5_1_10%]" : ""}
                              ${key === '⌫' ? "flex-[1.2_1_8%]" : ""}
                            `}
                          >
                            {key === 'space' ? 'Space' :
                             key === 'return' ? 'Return' :
                             key === '⇧' ? (capsLock ? '⇪' : '⇧') :
                             key}
                          </motion.button>
                        )
                      })}
                    </div>
                  ))}
                </div>
                
                {/* Additional info for split screen mode */}
                {position === 'split' && (
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Split screen mode - Content visible above keyboard
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}