# NAVI Automotive HMI - Complete Setup Guide

## What You're Building

**NAVI** - A professional automotive infotainment system featuring:
- ✅ Monochromatic CarPlay-inspired UI (Light & Dark modes)
- ✅ Tesla Model 3-style boot animation with splash screen
- ✅ Big round app launcher blocks (Maps, YouTube, Chrome, Camera, Controls, Settings)
- ✅ Intelligent auto-switching cameras based on vehicle signals
- ✅ Sentry mode activation with quad-view camera recording
- ✅ Vehicle signal simulator for testing
- ✅ Fluid animations and responsive design

---

## Quick Start (5 Minutes)

### Prerequisites
- **Node.js** 18+ (download from https://nodejs.org)
- **npm** 9+ (comes with Node.js)
- **Git** (optional, for version control)

### Installation

1. **Clone or download the project**
   \`\`\`bash
   git clone https://github.com/yourusername/NAVI-5k.git
   cd NAVI-5k
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`
   *(First time: 3-5 minutes. Subsequent: 10-30 seconds)*

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   - Navigate to: `http://localhost:3000`
   - Press `F11` for fullscreen
   - Watch the boot animation!

---

## 🎯 What You'll See

### Boot Sequence (4 seconds)
1. **Splash Screen** - Big "NAVI" text animated to bottom
2. **Subtitle** - "NaviCo by Ivan Mercado" fades in
3. **Loading** - 3 pulsing dots at bottom

### App Menu
- Large round blocks in grid layout:
  - 🗺️ **Google Maps** - Navigation
  - ▶️ **YouTube** - Video streaming
  - 🔍 **Google Chrome** - Web browsing
  - 📷 **Camera** - Rear view/security
  - ⚙️ **Controls** - Vehicle controls & media
  - 🔧 **Settings** - System settings

### Dashboard
- Real-time status bar (time, battery, temperature)
- Camera feeds with intelligent switching
- Vehicle signal indicators
- Media player controls
- Climate control system
- Vehicle simulator for testing

---

## 🎮 Testing Vehicle Signals

Go to **Controls** → **SIMULATOR** tab to test:

### Available Controls
1. **REVERSE** - Switches camera to rear view
2. **LEFT TURN** - Shows left camera in Picture-in-Picture (PIP)
3. **RIGHT TURN** - Shows right camera in PIP
4. **TRIGGER ALARM** - Activates Sentry Mode with quad-view

### Expected Behavior

| Signal | Effect |
|--------|--------|
| Reverse ON | Camera switches to full-screen rear view |
| Left Turn ON | Left camera shown in PIP (left side) |
| Right Turn ON | Right camera shown in PIP (right side) |
| Alarm Triggered | All 4 cameras shown (quad view), recording starts |

---

## 🎨 UI Design Details

### Color Scheme (Monochromatic CarPlay)

**Dark Mode (Default)**
- Background: `#1c1c1c` (near black)
- Foreground: `#ffffff` (white)
- Accent: `#ffffff` (matches foreground)
- Card: `#2d2d2d` (light black)

**Light Mode**
- Background: `#ffffff` (white)
- Foreground: `#000000` (black)
- Accent: `#000000` (matches foreground)
- Card: `#f5f5f5` (light grey)

### Animations
All animations are smooth 60fps transitions using Framer Motion:
- **Slide-in**: 300ms ease-out
- **Fade-in**: 300ms ease-out
- **Boot animation**: 4 seconds with text movement
- **Hover effects**: 100ms scale transforms
- **Recording pulse**: Continuous 1s loop

---

## 📁 Project Structure

\`\`\`
navi-5k/
├── app/
│   ├── page.tsx          # Main entry point (boot + app menu)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles & animations
│
├── components/
│   ├── splash-screen.tsx          # Boot animation
│   ├── app-menu.tsx               # App launcher grid
│   ├── sentry-mode.tsx            # Alarm screen
│   ├── camera-view.tsx            # Camera switching logic
│   ├── vehicle-simulator.tsx       # Signal simulation controls
│   ├── control-panel.tsx          # Media, climate, simulator tabs
│   ├── status-bar.tsx             # Top status bar
│   ├── media-player.tsx           # Audio/music control
│   ├── climate-control.tsx        # HVAC controls
│   └── ui/                        # 60+ shadcn components
│
├── hooks/
│   └── use-vehicle-state.ts       # Vehicle state management
│
├── types/
│   └── vehicle.ts                 # TypeScript interfaces
│
└── package.json
\`\`\`

---

## 🚀 Running the App

### Development Mode
\`\`\`bash
npm run dev
\`\`\`
- Auto-reload on code changes
- Debug console visible
- Hot Module Replacement (HMR) enabled

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`
- Optimized bundle
- Faster load times
- Ready for deployment

### Full-Screen Kiosk Mode (Electron Desktop)
\`\`\`bash
npm run dev:electron
\`\`\`
- Launches as fullscreen desktop app
- Windows/macOS/Linux support
- Perfect for in-vehicle deployment

---

## 🔧 Development Workflow

### Making Changes

1. **Edit a component** (e.g., `components/app-menu.tsx`)
2. **Save the file** - Changes auto-reload
3. **Check browser** - See live updates instantly
4. **Use React DevTools** (install extension) for debugging

### Common Tasks

#### Change App List
Edit `components/app-menu.tsx`, modify the `apps` array

#### Modify Colors
Edit `app/globals.css`, update CSS custom properties

#### Adjust Animations
Edit `app/globals.css`, modify `@keyframes` definitions

#### Add New Component
Create file in `components/`, import in page.tsx

---

## 🐛 Troubleshooting

### "Port 3000 is already in use"
\`\`\`bash
# Find process using port 3000
lsof -i :3000

# Kill it (macOS/Linux)
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
\`\`\`

### Blank screen on first load
- Check browser console for errors (F12)
- Clear browser cache (Ctrl+Shift+Delete)
- Try hard refresh (Ctrl+F5)

### Animations aren't smooth
- Disable browser extensions
- Check GPU acceleration is enabled
- Update to latest Chrome/Firefox

### Vehicle signals not working
- Check `use-vehicle-state.ts` exports
- Ensure `setReverse`, `setTurnSignal*`, `setAlarmTrip` are defined
- Open console (F12) and check for errors

---

## 📦 Building for Deployment

### Create Windows Installer
\`\`\`bash
npm run dist
\`\`\`
Output: `dist/NAVI Setup 1.0.0.exe`

### Create macOS DMG
\`\`\`bash
npm run dist
\`\`\`
Output: `dist/NAVI-1.0.0.dmg`

### Create Linux AppImage
\`\`\`bash
npm run dist
\`\`\`
Output: `dist/navi-1.0.0.AppImage`

---

## 🔌 Integration with ESP32

To connect real hardware:

1. **Connect ESP32 via USB**
2. **Create `lib/serial-handler.ts`** (handles USB communication)
3. **Replace mock data** in `use-vehicle-state.ts`
4. **Parse serial messages** from ESP32

Example ESP32 message format:
\`\`\`json
{
  "evt": "REVERSE_ON",
  "ts": 1699000000
}
\`\`\`

---

## 🎯 Next Steps

1. **Explore the code** - Start with `app/page.tsx`
2. **Customize branding** - Change "NaviCo" to your company
3. **Add your apps** - Replace placeholder apps in `app-menu.tsx`
4. **Connect hardware** - Integrate with ESP32 via serial
5. **Deploy** - Install on Windows 11 mini-PC in vehicle

---

## 📞 Support

For issues:
1. Check this guide's troubleshooting section
2. Review code comments for implementation details
3. Check browser console for error messages
4. Visit GitHub Issues for community help

---

**NAVI © 2025 | NaviCo | Founded by Ivan Mercado**

Happy building! 🚗✨
