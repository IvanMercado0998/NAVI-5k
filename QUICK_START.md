# NAVI - Quick Start Guide (5 minutes)

## Before You Start
- Install Node.js 18+ from [nodejs.org](https://nodejs.org)
- Install VS Code from [code.visualstudio.com](https://code.visualstudio.com)
- Have this folder open in VS Code

## Step 1: Open Terminal in VS Code
\`\`\`
Ctrl + ` (backtick key)
\`\`\`

## Step 2: Install Dependencies
Copy & paste into terminal:
\`\`\`bash
npm install
\`\`\`
**⏳ Takes 5-10 minutes first time**

## Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

**Expected output:**
\`\`\`
✔ Ready on http://localhost:3000
\`\`\`

## Step 4: Open in Browser
Click the link or visit: **http://localhost:3000**

## 🎉 You're Done!
NAVI is now running on your system!

---

## What You'll See

### Dark Mode (Default)
- Dark blue background (#0a0e27)
- Cyan accents (#00d9ff)
- Tesla-inspired layout

### Light Mode
- Click sun icon ☀️ in top-right
- White background
- Professional styling

### Try These Features
- **🎥 Camera** - View quad/PIP camera modes
- **⚙️ Controls** - Media & climate controls
- **⚡ Settings** - System configuration
- **▶ YouTube** - App launcher demo
- **◉ Chrome** - Browser app
- **🗺 Maps** - Navigation app
- **📷 Camera** - Camera app

---

## Common Issues & Fixes

### ❌ "Port 3000 already in use"
\`\`\`bash
npx kill-port 3000
npm run dev
\`\`\`

### ❌ "npm command not found"
Install Node.js: https://nodejs.org

### ❌ "Cannot find module"
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### ❌ "Electron window won't open"
- Wait 5 seconds after "Ready on http://localhost:3000"
- If still not opening, use browser only:
  \`\`\`bash
  npm run dev:next
  \`\`\`

---

## Build for Production

### Create Windows Installer
\`\`\`bash
npm run dist
\`\`\`

**Find these files in `dist/` folder:**
- `NAVI Setup 1.0.0.exe` - Installer
- `NAVI-1.0.0.exe` - Portable version

### Create macOS Package
\`\`\`bash
npm run dist
\`\`\`

**Outputs:**
- `NAVI-1.0.0.dmg` - Installer
- `NAVI-1.0.0-mac.zip` - Portable

### Create Linux Package
\`\`\`bash
npm run dist
\`\`\`

**Outputs:**
- `navi-1.0.0.AppImage` - Executable
- `navi-1.0.0.deb` - Package

---

## Next Steps

1. **Explore Components**
   - `app/page.tsx` - Main dashboard
   - `components/status-bar.tsx` - Top bar
   - `components/app-launcher.tsx` - App system
   - `components/camera-view.tsx` - Camera UI

2. **Customize UI**
   - Edit `app/globals.css` - Colors & animations
   - Update `components/` - Add features
   - Modify `types/vehicle.ts` - Data structure

3. **Connect Hardware**
   - Setup ESP32 serial communication
   - Update `lib/serial-manager.ts`
   - Configure baud rate & port

4. **Deploy**
   - Use `npm run dist` to package
   - Share `.exe` / `.dmg` / `.AppImage`
   - Install on target vehicle

---

## Keyboard Shortcuts (Development)

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl+R` | Refresh page |
| `Ctrl+Shift+I` | Inspect element |
| `Ctrl+Shift+C` | Select element |
| `Ctrl+Shift+M` | Toggle device mode |

---

## File Changes During Development

### Auto-reload Files
- `components/**/*.tsx` - 5ms reload
- `app/globals.css` - 1s reload
- `lib/**/*.ts` - Need manual refresh

### Manual Refresh
- Press `Ctrl+R` in app
- Or close/reopen Electron window

---

## Tips for Success

✅ **Keep Node.js Updated**
\`\`\`bash
node --version  # Should be 18+
\`\`\`

✅ **Use ES6+ Syntax**
\`\`\`typescript
// Good
const x = () => {}
const { a } = obj

// Avoid (old syntax)
var x = function() {}
\`\`\`

✅ **Format Code**
\`\`\`bash
npm run lint
\`\`\`

✅ **Check Types**
\`\`\`bash
npm run type-check
\`\`\`

---

## Get Help

### Documentation
- [Build Guide](./BUILD_GUIDE.md) - Comprehensive
- [README](./README.md) - Overview
- [Next.js Docs](https://nextjs.org/docs) - Framework

### Common Resources
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Electron: https://electronjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## Project Structure at a Glance

\`\`\`
navi-infotainment/
├── app/page.tsx              ← Main dashboard
├── components/
│   ├── status-bar.tsx        ← Top bar with apps
│   ├── app-launcher.tsx      ← YouTube, Chrome, Maps, Camera
│   ├── camera-view.tsx       ← Multi-camera system
│   └── ...
├── app/globals.css           ← Colors & animations
├── package.json              ← Dependencies
└── BUILD_GUIDE.md            ← Full documentation
\`\`\`

---

## Environment Variables (Optional)

Create `.env.local` for custom settings:

\`\`\`env
NEXT_PUBLIC_SERIAL_PORT=COM3
NEXT_PUBLIC_BAUD_RATE=115200
\`\`\`

---

**Built with ❤️ by NaviCo - Founded by Ivan Mercado 2025**

[← Back to README](./README.md)
