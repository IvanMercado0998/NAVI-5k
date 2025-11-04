# NAVI Installation & Deployment Guide

## Complete Step-by-Step Setup for Windows 11, macOS, and Linux

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Windows 11 Installation](#windows-11-installation)
- [macOS Installation](#macos-installation)
- [Linux Installation](#linux-installation)
- [Verifying Your Installation](#verifying-your-installation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need
- **Computer:** Windows 11, macOS 12+, or Ubuntu 20.04+
- **Internet Connection:** Required for npm package download (~500MB)
- **Administrator Access:** May be required for some installations
- **Text Editor:** VS Code (recommended) or any code editor
- **Git (Optional):** For cloning the repository

### Check Your System

#### Check Node.js
Open Terminal/PowerShell and run:
\`\`\`bash
node --version
npm --version
\`\`\`

Should show: `v18.0.0` or higher (v20 LTS recommended)

If not installed, download from [nodejs.org](https://nodejs.org)

---

## Windows 11 Installation

### Step 1: Install Node.js
1. Visit [nodejs.org](https://nodejs.org)
2. Download "LTS" version (recommended)
3. Run installer
4. Follow prompts (default settings are fine)
5. **Restart your computer**

### Step 2: Verify Installation
Open PowerShell (press `Win+R`, type `powershell`, press Enter):
\`\`\`powershell
node --version
npm --version
\`\`\`

### Step 3: Install Git (Optional but Recommended)
1. Download from [git-scm.com](https://git-scm.com)
2. Run installer with default settings
3. Restart PowerShell

### Step 4: Clone/Extract Project
**Option A - Using Git:**
\`\`\`powershell
git clone https://github.com/navico/navi-infotainment.git
cd navi-infotainment
\`\`\`

**Option B - Manual Download:**
1. Download ZIP from GitHub
2. Extract to desired folder
3. Open PowerShell in that folder (Shift+Right-click → Open PowerShell)

### Step 5: Install Dependencies
\`\`\`powershell
npm install
\`\`\`

**⏳ First time: 5-15 minutes (depends on internet speed)**

Wait for completion. You should see:
\`\`\`
added XXX packages
\`\`\`

### Step 6: Start Development
\`\`\`powershell
npm run dev
\`\`\`

**Expected output:**
\`\`\`
> dev
> concurrently "npm run dev:next" "npm run dev:electron"

✔ Ready on http://localhost:3000
✓ Ready on http://localhost:3000
\`\`\`

### Step 7: Access NAVI
- **Browser:** Visit `http://localhost:3000`
- **Desktop:** Electron window opens automatically (may take 3-5 seconds)

---

## macOS Installation

### Step 1: Install Node.js

**Option A - Using Homebrew (Recommended):**
\`\`\`bash
# First install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
\`\`\`

**Option B - Direct Download:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download macOS Installer
3. Run and follow prompts

### Step 2: Verify Installation
Open Terminal and run:
\`\`\`bash
node --version
npm --version
\`\`\`

### Step 3: Clone Project
\`\`\`bash
git clone https://github.com/navico/navi-infotainment.git
cd navi-infotainment
\`\`\`

### Step 4: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 5: Grant Permissions (If Needed)
\`\`\`bash
chmod +x node_modules/.bin/*
\`\`\`

### Step 6: Start Development
\`\`\`bash
npm run dev
\`\`\`

### Step 7: Access NAVI
- **Browser:** Open `http://localhost:3000`
- **Desktop:** Electron app launches automatically

---

## Linux Installation

### Ubuntu 20.04+

### Step 1: Install Node.js
\`\`\`bash
# Update package manager
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify
node --version
npm --version
\`\`\`

### Step 2: Install Git
\`\`\`bash
sudo apt install git
\`\`\`

### Step 3: Clone Project
\`\`\`bash
git clone https://github.com/navico/navi-infotainment.git
cd navi-infotainment
\`\`\`

### Step 4: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 5: Grant Permissions
\`\`\`bash
chmod +x node_modules/.bin/*
\`\`\`

### Step 6: Start Development
\`\`\`bash
npm run dev
\`\`\`

### Step 7: Access NAVI
- **Browser:** Open `http://localhost:3000`
- **Desktop:** Electron app launches (if X11/Wayland properly configured)

---

## Verifying Your Installation

### ✅ Checks to Perform

1. **Node.js Check**
   \`\`\`bash
   node --version  # Should be v18+
   npm --version   # Should be v9+
   \`\`\`

2. **Dependencies Check**
   \`\`\`bash
   npm run type-check
   \`\`\`
   Should complete without errors.

3. **Build Check**
   \`\`\`bash
   npm run build:next
   \`\`\`
   Should create `dist/` folder.

4. **Browser Access**
   - `npm run dev:next`
   - Visit `http://localhost:3000`
   - Should see NAVI UI with dark theme

5. **Desktop App Check**
   - `npm run dev`
   - Should open Electron window automatically
   - Window title should say "NAVI - Premium Automotive Infotainment System"

---

## Creating Distribution Packages

### Build for Windows

\`\`\`powershell
npm run dist
\`\`\`

**Outputs to `dist/`:**
- `NAVI Setup 1.0.0.exe` - Installer (~150MB)
- `NAVI-1.0.0.exe` - Portable executable

**Install locally:**
- Double-click `.exe` file
- Follow installation wizard

### Build for macOS

\`\`\`bash
npm run dist
\`\`\`

**Outputs to `dist/`:**
- `NAVI-1.0.0.dmg` - Disk image
- `NAVI-1.0.0-mac.zip` - Portable

**Install locally:**
- Open `.dmg` file
- Drag NAVI to Applications folder

### Build for Linux

\`\`\`bash
npm run dist
\`\`\`

**Outputs to `dist/`:**
- `navi-1.0.0.AppImage` - Universal executable
- `navi-1.0.0.deb` - Debian package

**Install locally:**
- AppImage: `./navi-1.0.0.AppImage`
- Deb: `sudo dpkg -i navi-1.0.0.deb`

---

## Troubleshooting

### ❌ Node.js Not Found

**Windows:**
1. Restart PowerShell
2. Run: `$env:Path`
3. Check if Node.js path is listed
4. If not, reinstall Node.js

**macOS/Linux:**
\`\`\`bash
which node
which npm
\`\`\`

If empty, reinstall Node.js.

### ❌ Permission Denied

**macOS/Linux:**
\`\`\`bash
sudo chown -R $(whoami):$(whoami) ~/.npm
npm cache clean --force
npm install
\`\`\`

### ❌ Port 3000 Already in Use

**Windows:**
\`\`\`powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

**macOS/Linux:**
\`\`\`bash
lsof -i :3000
kill -9 <PID>
\`\`\`

### ❌ npm install Hangs

\`\`\`bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

### ❌ Electron Window Won't Open

1. Wait 10 seconds after "Ready on http://localhost:3000"
2. Check if Next.js is running: `http://localhost:3000`
3. Try restarting: `npm run dev`

### ❌ "Cannot find module" Error

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

### ❌ Serial Port Not Recognized

**Windows:**
1. Check Device Manager → COM Ports
2. Verify USB cable connection
3. Install CH340 driver if needed

**macOS/Linux:**
\`\`\`bash
ls /dev/tty*
\`\`\`

Should list `/dev/ttyUSB0` or similar.

---

## Next Steps After Installation

### 1. Explore the UI
- Open `http://localhost:3000`
- Try different themes (click sun/moon icon)
- Explore camera, controls, and settings

### 2. Customize
- Edit `app/globals.css` for colors
- Modify `components/` for features
- Update `types/vehicle.ts` for data

### 3. Connect Hardware
- Setup ESP32 microcontroller
- Update serial port in `lib/serial-manager.ts`
- Configure baud rate

### 4. Build Distribution
- Run `npm run dist`
- Share `.exe`, `.dmg`, or `.AppImage`
- Install on target vehicle

---

## Performance Recommendations

### For Smooth Operation
- Close unnecessary apps (browser tabs, Discord, etc.)
- Ensure 2GB+ free RAM
- SSD recommended (500GB+)
- Update GPU drivers
- Disable power saving features

### Development Tips
- Use Chrome DevTools (F12) for debugging
- Monitor Performance tab for optimization
- Use Lighthouse for audits
- Check Memory profiler for leaks

---

## Getting Help

### Documentation
- [README.md](./README.md) - Project overview
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Detailed build guide
- [QUICK_START.md](./QUICK_START.md) - 5-minute setup

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Electron Guide](https://electronjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Contact
- **Email:** support@navico.com
- **GitHub Issues:** Report bugs
- **Discussions:** Ask questions

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Development (Next.js + Electron) |
| `npm run dev:next` | Development (browser only) |
| `npm run build` | Build for production |
| `npm run dist` | Create distribution packages |
| `npm run lint` | Check code quality |
| `npm run type-check` | TypeScript validation |

---

**Built with ❤️ by NaviCo - Est. 2025**  
**Founded by Ivan Mercado**
