// app/layout.tsx

/**
 * NAVI Infotainment System - Root Layout Component
 * 
 * @description
 * Root layout component for the NAVI automotive infotainment system.
 * Provides the foundational HTML structure, metadata, and theme provider
 * for the entire application. All other components are rendered within this layout.
 * Includes virtual keyboard wrapper for touch input support across all screens.
 * 
 * @version 2.1.0
 * @author Ivan Mercado
 * @created 2025
 * 
 * @features
 * - HTML document structure with proper lang attribute
 * - SEO-optimized metadata and title tags
 * - Theme provider for consistent styling across the application
 * - Global CSS imports for base styling
 * - Hydration warning suppression for better development experience
 * - Virtual keyboard integration for all input fields
 * - Automatic keyboard show/hide on input focus
 * 
 * @structure
 * - HTML wrapper with English language setting
 * - Head section with metadata and title
 * - Body with theme provider and keyboard wrapper
 * - Global CSS styles application
 * 
 * @metadata
 * - Title: NAVI - Premium Automotive Infotainment System
 * - Description: NaviCo Advanced Infotainment by Ivan Mercado | EST. 2025
 * - Application Name: NAVI
 * - Generator: v0.app
 * 
 * @theming
 * - ThemeProvider: Enables light/dark mode functionality
 * - Default Theme: Light mode
 * - System Theme Detection: Disabled for consistent automotive experience
 * - CSS Variables: Custom properties for consistent design tokens
 * 
 * @keyboard
 * - VirtualKeyboard: Custom touch keyboard component
 * - Auto-show: Appears when inputs are focused
 * - Auto-hide: Disappears when inputs lose focus
 * - Cross-platform: Works on all devices and operating systems
 */

"use client"

import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import KeyboardWrapper from "@/components/keyboard-wrapper"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>NAVI - Premium Automotive Infotainment System</title>
        <meta name="description" content="NaviCo Advanced Infotainment by Ivan Mercado | EST. 2025" />
        <meta name="application-name" content="NAVI" />
        <meta name="generator" content="v0.app" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <KeyboardWrapper>
            {children}
          </KeyboardWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}