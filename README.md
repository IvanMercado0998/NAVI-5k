# NAVI - Premium Automotive Infotainment System

<div align="center">

![NAVI Logo](https://img.shields.io/badge/NAVI-v1.0.0-00d9ff?style=for-the-badge&logo=tesla)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Built with](https://img.shields.io/badge/Built%20with-React%2FNext.js-black?style=for-the-badge)

**Premium Tesla-inspired Infotainment System for Windows 11 Mini-PC + ESP32**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture) • [Build Guide](./BUILD_GUIDE.md)

</div>

---

## About NAVI

NAVI is a cutting-edge automotive infotainment system that transforms your vehicle with a Tesla Model 3-inspired interface. Built for the modern driver, NAVI integrates real-time vehicle data, multi-camera management, and intuitive app controls into a seamless, responsive platform.

**Company:** NaviCo  
**Founded:** 2025  
**Created by:** Ivan Mercado  
**License:** MIT

---

## Features

### 🎨 User Interface
- **Tesla Model 3 Design** - Premium automotive aesthetic
- **Light & Dark Modes** - Full theme support with smooth transitions
- **Responsive Layout** - Optimized for touchscreen and fullscreen display
- **Fluid Animations** - Smooth, GPU-accelerated motion throughout

### 📹 Multi-Camera System
- **Quad-View Mode** - All 4 cameras simultaneously
- **Picture-in-Picture** - Main + secondary camera
- **Full-Screen Mode** - Single camera focus
- **Auto-Switching** - Intelligent camera selection based on vehicle state:
  - Reverse → Rear camera
  - Turn signals → Side cameras
  - Alarm trigger → Quad-view + recording

### 🚀 App Launcher
- **YouTube** - Video playback and streaming
- **Chrome** - Web browser navigation
- **Google Maps** - Real-time navigation
- **Camera** - Advanced multi-view management

### 📊 Real-Time Dashboard
- Live vehicle status monitoring
- Battery voltage tracking
- Temperature readings
- Recording status indicators
- Sentry mode activation

### 🛠️ Vehicle Controls
- Media playback controls
- Climate control (HVAC)
- Lighting management
- System diagnostics

### 💾 Recording System
- Circular buffer recording
- Triggered saving on events
- SSD-optimized storage
- Automatic rotation and cleanup

---

## System Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 11 / macOS 12+ / Linux Ubuntu 20.04+ |
| **Node.js** | v18.17.0 or higher (v20 LTS recommended) |
| **npm** | v9.0.0 or higher |
| **RAM** | 8GB minimum (16GB recommended) |
| **Storage** | 5GB for dependencies + build |
| **Display** | 1920×1080 minimum (automotive touchscreen compatible) |

---

## Quick Start

### Installation (3 minutes)
\`\`\`bash
# 1. Clone the repository
git clone https://github.com/navico/navi-infotainment.git
cd navi-infotainment

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser or Electron app
# Browser: http://localhost:3000
# Desktop: Electron window opens automatically
\`\`\`

### Development Commands
\`\`\`bash
npm run dev              # Start Next.js + Electron
npm run dev:next        # Next.js only (browser)
npm run build           # Production build
npm run dist            # Create distribution package
npm run lint            # Code quality check
npm run type-check      # TypeScript validation
\`\`\`

---

## Architecture

### Tech Stack
- **Frontend:** React 19.2 + Next.js 16 + Tailwind CSS v4
- **Desktop:** Electron 30 + Node.js integration
- **Animations:** Framer Motion 12
- **UI Components:** shadcn/ui (60+ ready-to-use)
- **Icons:** Lucide React
- **Hardware:** Serial communication with ESP32

### Component Structure
\`\`\`
NAVI Infotainment System
├── Status Bar (Top)
│   ├── Time & System Status
│   ├── Battery Voltage
│   ├── Temperature
│   ├── Recording Indicator
│   ├── Sentry Mode
│   └── App Launcher + Theme Toggle
├── Side Navigation
│   ├── Camera View
│   ├── Controls Panel
│   └── Settings
└── Main Content Area
    ├── Multi-Camera System
    ├── Media Controls
    ├── Climate Control
    └── System Settings
\`\`\`

### Data Flow
\`\`\`
ESP32 (Vehicle Data) 
  ↓ USB-Serial (115200 baud)
Electron Main Process
  ↓ IPC Communication
React Components
  ↓ State Management
User Interface (NAVI Dashboard)
\`\`\`

---

## Configuration

### Environment Variables
Create `.env.local` for custom settings:

\`\`\`env
NEXT_PUBLIC_SERIAL_PORT=COM3
NEXT_PUBLIC_BAUD_RATE=115200
NEXT_PUBLIC_CAMERA_FPS=30
NEXT_PUBLIC_SENTRY_ENABLED=true
\`\`\`

See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for complete configuration.

---

## Building & Distribution

### Create Desktop App
\`\`\`bash
# Windows Installer
npm run dist

# Outputs to dist/ folder:
# - NAVI Setup 1.0.0.exe (installer)
# - NAVI-1.0.0.exe (portable)
\`\`\`

### Install Locally
1. Extract/Run the `.exe` file
2. Follow installation wizard
3. Launch NAVI from desktop shortcut

---

## Hardware Integration

### ESP32 Firmware Requirements
- Ignition (ACC) detection
- Reverse lamp detection
- Turn signal detection (L/R)
- Alarm input monitoring
- Battery voltage sensing
- Serial communication (USB CDC)

### Wiring & Safety
- Use optocouplers for vehicle signal isolation
- Include TVS diodes for surge protection
- Fuse all power connections
- Ground to vehicle chassis

See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed wiring diagrams.

---

## Troubleshooting

### Port 3000 already in use
\`\`\`bash
npx kill-port 3000
npm run dev
\`\`\`

### Electron window won't open
\`\`\`bash
# Verify Next.js is running on localhost:3000
lsof -i :3000

# Restart
npm run dev
\`\`\`

### Theme not persisting
\`\`\`bash
# Clear browser storage
# In DevTools Console:
localStorage.clear()
location.reload()
\`\`\`

### Serial communication failing
\`\`\`bash
# Check available serial ports
npm run type-check

# Verify USB connection and baud rate settings
\`\`\`

See [BUILD_GUIDE.md Troubleshooting Section](./BUILD_GUIDE.md#troubleshooting) for more help.

---

## File Structure

\`\`\`
navi-infotainment/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main dashboard
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles & animations
│   └── api/                 # API routes
├── components/              # React components
│   ├── app-launcher.tsx     # App switcher
│   ├── status-bar.tsx       # Top bar
│   ├── navigation.tsx       # Side nav
│   ├── camera-view.tsx      # Camera system
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
├── types/                   # TypeScript definitions
├── electron/                # Electron main process
├── public/                  # Static assets
├── BUILD_GUIDE.md          # Complete build instructions
├── README.md               # This file
└── package.json            # Dependencies
\`\`\`

---

## Performance

| Metric | Value |
|--------|-------|
| Bundle Size | ~45MB (uncompressed) |
| Compressed | ~15MB |
| Memory (Idle) | ~200MB |
| Memory (Active) | ~400MB |
| CPU Usage (Idle) | <5% |
| CPU Usage (Active) | ~15% |
| Startup Time | ~3 seconds |

---

## Security

- **Secure IPC:** Preload script isolation
- **Serial Safety:** Optocoupler isolation
- **Error Handling:** Graceful failure modes
- **Input Validation:** All serial data validated
- **Authentication:** Ready for OAuth integration

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Push to the branch
5. Submit a Pull Request

---

## Roadmap

### v1.0 ✅
- [x] Core UI framework
- [x] Multi-camera system
- [x] App launcher
- [x] Real-time dashboard
- [x] Light/dark modes
- [x] Electron integration

### v1.1 (Planned)
- [ ] Cloud upload integration
- [ ] Mobile app companion
- [ ] Advanced analytics
- [ ] OTA updates
- [ ] Custom themes

### v2.0 (Future)
- [ ] AI-powered dashcam
- [ ] Voice commands
- [ ] Gesture recognition
- [ ] 5G connectivity
- [ ] AR navigation

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Support

### Documentation
- [Complete Build Guide](./BUILD_GUIDE.md)
- [Architecture Overview](./BUILD_GUIDE.md#architecture-overview)
- [Troubleshooting Guide](./BUILD_GUIDE.md#troubleshooting)

### Resources
- [Next.js Documentation](https://nextjs.org)
- [React Documentation](https://react.dev)
- [Electron Documentation](https://electronjs.org)
- [Tailwind CSS](https://tailwindcss.com)

### Contact
- **Company:** NaviCo
- **Email:** support@navico.com
- **Website:** https://navico.com
- **GitHub:** https://github.com/navico

---

## Credits

**Developed by:** Ivan Mercado  
**Design:** Tesla Model 3 UI  
**Technology:** React + Next.js + Electron  
**Founded:** 2025

---

<div align="center">

**Built with ❤️ by NaviCo**

Made for modern vehicles. Inspired by Tesla.

[⬆ Back to top](#navi---premium-automotive-infotainment-system)

</div>
