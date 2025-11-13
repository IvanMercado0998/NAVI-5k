// Do not change logic
//components\keyboard-wrapper.tsx

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import VirtualKeyboard from "./virtual-keyboard"

export default function KeyboardWrapper({ children }: { children: React.ReactNode }) {
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardPosition, setKeyboardPosition] = useState<'bottom' | 'split'>('bottom')
  const focusedInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const keyboardRef = useRef<HTMLDivElement>(null)

  // ✅ Split screen toggle functionality this should be left split screen then full split screen
  const toggleKeyboardPosition = () => {
    setKeyboardPosition(prev => prev === 'bottom' ? 'split' : 'bottom')
  }

  const handleInput = useCallback((value: string) => {
    const focusedInput = focusedInputRef.current
    if (!focusedInput) return

    // Ensure input is focused and visible
    focusedInput.focus()
    
    const start = focusedInput.selectionStart ?? 0
    const end = focusedInput.selectionEnd ?? 0

    switch (value) {
      case 'Backspace':
        if (start === end && start > 0) {
          focusedInput.setSelectionRange(start - 1, start)
          document.execCommand('delete', false)
        } else if (start !== end) {
          document.execCommand('delete', false)
        }
        break

      case 'Enter':
        focusedInput.focus()
        break

      case 'Tab':
        // Find next focusable element
        const focusableElements = Array.from(
          document.querySelectorAll('input, textarea, button, select, [tabindex]:not([tabindex="-1"])')
        ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1')
        
        const currentIndex = focusableElements.indexOf(focusedInput)
        if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
          (focusableElements[currentIndex + 1] as HTMLElement).focus()
        }
        break

      case 'Escape':
        setShowKeyboard(false)
        break

      case 'SplitScreen':
        toggleKeyboardPosition()
        return // Don't input anything

      default:
        // Use modern clipboard API for better reliability
        focusedInput.focus()
        
        // For modern browsers, use execCommand as fallback
        try {
          document.execCommand('insertText', false, value)
        } catch (error) {
          // Fallback: direct value manipulation
          const newValue = focusedInput.value.slice(0, start) + value + focusedInput.value.slice(end)
          focusedInput.value = newValue
          focusedInput.selectionStart = focusedInput.selectionEnd = start + value.length
          
          // Trigger React events
          const inputEvent = new Event('input', { bubbles: true })
          focusedInput.dispatchEvent(inputEvent)
        }
        break
    }

    // Ensure focus stays on input
    setTimeout(() => {
      if (focusedInputRef.current) {
        focusedInputRef.current.focus()
      }
    }, 10)
  }, [])

  // ✅ Global keyboard detection without interference
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      
      // Show keyboard for any input/textarea that doesn't explicitly opt out
      if ((target.tagName === "INPUT" || target.tagName === "TEXTAREA") && 
          !target.hasAttribute('data-no-virtual-keyboard')) {
        
        focusedInputRef.current = target as HTMLInputElement
        setShowKeyboard(true)
        
        // Auto-detect if split screen would be better (large textareas)
        if (target.tagName === "TEXTAREA" || target.getAttribute('type') === 'email') {
          setKeyboardPosition('split')
        }
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Don't close keyboard when clicking inside it
      if (keyboardRef.current?.contains(target)) {
        return
      }
      
      // Update focused input if clicking on another input
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (!target.hasAttribute('data-no-virtual-keyboard')) {
          focusedInputRef.current = target as HTMLInputElement
          setShowKeyboard(true)
        }
      } else {
        // Keep keyboard open but allow interaction with other elements
        // Only close if explicitly clicking a close button or similar
        const isCloseAction = target.closest('[data-close-keyboard]') || 
                             target.hasAttribute('data-close-keyboard')
        
        if (isCloseAction) {
          setShowKeyboard(false)
          focusedInputRef.current = null
        }
      }
    }

    // Handle physical keyboard to detect when user starts typing
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close keyboard on Escape key
      if (e.key === 'Escape' && showKeyboard) {
        setShowKeyboard(false)
        focusedInputRef.current = null
      }
      
      // Switch to split screen on certain keys or conditions
      if ((e.key === 'F2' || e.ctrlKey) && showKeyboard) {
        toggleKeyboardPosition()
      }
    }

    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("touchstart", handleClick)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("touchstart", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [showKeyboard])

  const handleClose = () => {
    setShowKeyboard(false)
    if (focusedInputRef.current) {
      focusedInputRef.current.blur()
    }
    focusedInputRef.current = null
  }

  // ✅ Enhanced keyboard props for split screen functionality
  const keyboardProps = {
    visible: showKeyboard,
    onInput: handleInput,
    onClose: handleClose,
    position: keyboardPosition,
    onTogglePosition: toggleKeyboardPosition
  }

  return (
    <>
      {children}
      
      {/* ✅ Keyboard with proper layering - allows interaction with upper screen */}
      <div 
        ref={keyboardRef} 
        className={`virtual-keyboard ${
          // Use moderate z-index z-40 for split screen only 
          showKeyboard ? 'z-9999' : 'z-0'
        }`}
        style={{
          // Ensure keyboard doesn't block other elements unnecessarily
          pointerEvents: showKeyboard ? 'auto' : 'none'
        }}
      >
        <VirtualKeyboard {...keyboardProps} />
      </div>
      
      {/* ✅ Optional: Add a split screen toggle button that's always accessible */}
      {showKeyboard && (
        <button
          onClick={toggleKeyboardPosition}
          className="fixed bottom-20 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title={`Switch to ${keyboardPosition === 'bottom' ? 'split' : 'bottom'} screen`}
        >
          {keyboardPosition === 'bottom' ? '↗' : '↙'}
        </button>
      )}
    </>
  )
}