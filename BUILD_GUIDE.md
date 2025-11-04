# Tesla UI Frontend - Complete Build Guide

This guide covers building, developing, and packaging the Tesla Infotainment System with Electron and Next.js.

## Prerequisites

### Required Software
- **Node.js** (v18.17 or higher) - [Download](https://nodejs.org/)
- **npm** or **pnpm** (v9+) - Comes with Node.js or install separately
- **Git** - [Download](https://git-scm.com/)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)

### Platform-Specific Requirements

#### Windows
- **Python** (3.8+) - Required for native module compilation
- **Visual Studio Build Tools** or **Visual Studio Community** with C++ workload
- **USB Driver** - CH340 driver for serial communication (if using ESP32)

#### macOS
- **Xcode Command Line Tools**
  \`\`\`bash
  xcode-select --install
  \`\`\`
- **Python** (3.8+)

#### Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt-get install build-essential python3
sudo apt-get install libusb-1.0-0-dev
\`\`\`

## Installation

### Step 1: Clone & Install Dependencies
\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd tesla-ui-frontend

# Install dependencies
npm install
# or
pnpm install
\`\`\`

### Step 2: Verify Serial Port Access

#### Windows
- Connect ESP32 via USB
- Device Manager should show "COM3" or similar under "Ports (COM & LPT)"

#### macOS/Linux
- Connect ESP32 via USB
- Find the port:
  \`\`\`bash
  ls /dev/tty.* # macOS
  ls /dev/ttyUSB* # Linux
  \`\`\`

### Step 3: Configure Environment (Optional)
Create a `.env.local` file if needed:
\`\`\`
# Serial port configuration
SERIAL_PORT=/dev/ttyUSB0  # Linux/macOS
# or COM3 on Windows

# Camera settings
CAMERA_FPS=30
CAMERA_RESOLUTION_WIDTH=1280
CAMERA_RESOLUTION_HEIGHT=720
\`\`\`

## Development Workflow

### Running in Development Mode
\`\`\`bash
npm run dev
\`\`\`

This command:
1. Starts Next.js dev server on `http://localhost:3000`
2. Waits for the server to be ready
3. Launches Electron pointing to the dev server
4. Opens DevTools for debugging

### Hot Reload
- **Next.js**: Automatic hot reload on file changes (UI files)
- **Electron Main Process**: Requires manual restart (Ctrl+R or Cmd+R)

### Key Development Tasks
\`\`\`bash
# Run Next.js only (for web testing)
npm run dev:next

# Run Electron only (requires pre-built Next.js)
npm run dev:electron

# Type checking
npm run type-check

# Linting
npm run lint
\`\`\`

## Building for Production

### Step 1: Build Next.js
\`\`\`bash
npm run build:next
\`\`\`
This creates a static export in `dist/renderer`.

### Step 2: Compile Electron Files
\`\`\`bash
npm run build:electron
npm run build:preload
\`\`\`

### Step 3: Package as Desktop App
\`\`\`bash
npm run dist
\`\`\`

This generates platform-specific installers in the `dist` folder:
- **Windows**: `Tesla Infotainment System Setup 1.0.0.exe` (NSIS installer)
- **macOS**: `Tesla Infotainment System-1.0.0.dmg`
- **Linux**: `Tesla Infotainment System-1.0.0.AppImage`

### Full Build Command
\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
tesla-ui-frontend/
├── app/
│   ├── api/
│   │   ├── camera/          # Camera streaming endpoints
│   │   └── serial/          # Serial communication endpoints
│   ├── page.tsx             # Main dashboard page
│   ├── layout.tsx           # Root layout with metadata
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard-layout.tsx # Main layout wrapper
│   ├── camera-view.tsx      # Camera display
│   ├── control-panel.tsx    # Vehicle controls
│   ├── status-bar.tsx       # System status display
│   └── system-settings.tsx  # Settings panel
├── hooks/
│   ├── use-vehicle-state.ts # Shared vehicle state
│   ├── use-serial.ts        # Serial communication hook
│   └── use-camera.ts        # Camera management hook
├── lib/
│   ├── serial-manager.ts    # Serial port handling
│   ├── serial-protocol.ts   # Tesla protocol implementation
│   └── camera-manager.ts    # Camera control logic
├── types/
│   └── vehicle.ts           # TypeScript type definitions
├── electron/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # IPC bridge (secure context)
│   └── ipc-handlers.ts      # IPC message handlers
├── public/
│   ├── placeholder-logo.svg # App icon
│   └── placeholder-logo.png # App icon (PNG)
├── next.config.mjs          # Next.js configuration
├── electron-builder.json    # Electron packaging config
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
\`\`\`

## Debugging

### VS Code Debugging Setup

Create `.vscode/launch.json`:
\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Electron Main",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/dist/main/main.js",
      "restart": true,
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "runtimeArgs": ["."],
      "protocol": "inspector"
    },
    {
      "name": "Next.js Dev",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.next/development/server",
      "console": "integratedTerminal"
    }
  ]
}
\`\`\`

### Debug Serial Communication
Enable detailed logging in `lib/serial-manager.ts`:
\`\`\`typescript
if (process.env.DEBUG_SERIAL === 'true') {
  console.log('[SERIAL]', message)
}
\`\`\`

Then run with:
\`\`\`bash
DEBUG_SERIAL=true npm run dev
\`\`\`

### Electron DevTools
- Automatically opens during development
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) to toggle

## Common Issues & Solutions

### Issue: "Cannot find module '@serialport/bindings'"
**Solution**: Rebuild native modules
\`\`\`bash
npm rebuild serialport
\`\`\`

### Issue: Electron fails to start
**Solution**: Ensure Next.js dev server is running
\`\`\`bash
npm run dev:next  # In one terminal
npm run dev:electron  # In another terminal
\`\`\`

### Issue: Serial port not detected
**Solution**: Check permissions and drivers
\`\`\`bash
# Linux: Add user to dialout group
sudo usermod -a -G dialout $USER

# macOS: Check device
ls /dev/tty.usbserial-*
\`\`\`

### Issue: Build fails on Windows
**Solution**: Install required build tools
\`\`\`bash
npm install --global windows-build-tools
\`\`\`

## VS Code Extensions (Recommended)

1. **ESLint** - Microsoft
2. **Prettier** - Code formatter
3. **Thunder Client** - API testing
4. **Better Comments** - Comment highlighting
5. **Code Spell Checker** - Spell checking
6. **GitLens** - Git integration

Install via: `Ctrl+Shift+X` (Extensions panel)

## Troubleshooting Checklist

- [ ] Node.js version 18.17+
- [ ] All dependencies installed (`npm install`)
- [ ] USB device connected and detected
- [ ] Serial port drivers installed
- [ ] No other apps using the serial port
- [ ] Build files cleared (`rm -rf .next dist node_modules`)
- [ ] Port 3000 is available (or change in dev config)
- [ ] Sufficient disk space for builds

## Performance Optimization

### Development
- Use `npm run dev:next` alone for faster UI iteration
- Disable camera streaming in settings while developing
- Use VS Code debugger instead of console.log for better performance

### Production
- Built app uses ~150MB disk space
- Startup time: 2-3 seconds on modern hardware
- Memory usage: 100-150MB idle, up to 500MB during camera streaming

## Distribution

### Creating Installers for Platforms

\`\`\`bash
# Windows only
npm run dist -- --win

# macOS only
npm run dist -- --mac

# Linux only
npm run dist -- --linux

# All platforms
npm run dist
\`\`\`

### Signing & Notarization (macOS)
For production releases, add to `electron-builder.json`:
\`\`\`json
"mac": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}
\`\`\`

## CI/CD Integration (GitHub Actions)

Create `.github/workflows/build.yml`:
\`\`\`yaml
name: Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm run dist
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}
          path: dist/*.{exe,dmg,AppImage}
\`\`\`

## Next Steps

1. **Customize branding**: Replace icons in `public/`
2. **Configure serial protocol**: Modify `lib/serial-protocol.ts`
3. **Add vehicle-specific features**: Extend `components/control-panel.tsx`
4. **Set up CI/CD**: Create GitHub Actions workflow
5. **Deploy**: Publish installers to release site

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Electron Docs**: https://www.electronjs.org/docs
- **Shadcn/UI**: https://ui.shadcn.com/
- **Node Serial Port**: https://serialport.io/

## Version History

- **1.0.0** (Current): Initial release with dashboard, serial communication, and recording
