# NAVI - Quick Command Reference

## Essential Commands

### 1. First Time Setup
\`\`\`bash
npm install
\`\`\`
Installs all dependencies (3-5 minutes)

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
- Opens at `http://localhost:3000`
- Auto-reloads on code changes
- Press `Ctrl+C` to stop

### 3. Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`
Creates optimized production build

### 4. Create Installers (All Platforms)
\`\`\`bash
npm run dist
\`\`\`
Creates executables in `dist/` folder

---

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code |
| `npm run dist` | Build installers (Windows/macOS/Linux) |

---

## Testing Vehicle Signals

1. Start the app: `npm run dev`
2. Go to **Controls** → **SIMULATOR**
3. Click buttons to test:
   - **REVERSE** - triggers rear camera
   - **LEFT TURN** - shows left camera in PIP
   - **RIGHT TURN** - shows right camera in PIP
   - **TRIGGER ALARM** - activates Sentry Mode

---

## Troubleshooting Commands

### Clear Node Modules & Reinstall
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Clean Build Cache
\`\`\`bash
rm -rf .next dist
npm run build
\`\`\`

### Force Kill Port 3000
\`\`\`bash
# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
\`\`\`

### Test Individual Components
\`\`\`bash
# Run a single file test
npx jest components/splash-screen.tsx
\`\`\`

---

## Environment Variables

Create `.env.local` file:
\`\`\`env
NEXT_PUBLIC_APP_NAME=NAVI
NEXT_PUBLIC_COMPANY=NaviCo
NEXT_PUBLIC_FOUNDER=Ivan Mercado
\`\`\`

---

## Git Commands (Optional)

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/NAVI-5k.git

# Create a new branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/your-feature
\`\`\`

---

## Useful Chrome DevTools Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl+Shift+I` | Open DevTools (alt) |
| `Ctrl+Shift+J` | Open Console tab |
| `Ctrl+Shift+M` | Toggle device/mobile view |
| `Ctrl+Shift+Delete` | Clear cache |

---

## Performance Check

\`\`\`bash
# Check bundle size
npm run build
# Look at .next/static/ folder

# Analyze dependencies
npm list
\`\`\`

---

## Quick Restart (If Something Breaks)

\`\`\`bash
# 1. Stop the server (Ctrl+C)
# 2. Clear cache
rm -rf .next

# 3. Reinstall dependencies
npm install

# 4. Start again
npm run dev
\`\`\`

---

## Deployment Checklist

- [ ] Code tested locally (`npm run dev`)
- [ ] No console errors (F12)
- [ ] Build completes successfully (`npm run build`)
- [ ] Installers created (`npm run dist`)
- [ ] README updated with changes
- [ ] Git committed and pushed
- [ ] Ready for production deployment

---

**NAVI © 2025 | NaviCo**
