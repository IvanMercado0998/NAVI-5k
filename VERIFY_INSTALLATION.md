# NAVI Installation Verification Guide

## ✅ Pre-Installation Checklist

Before installing, verify you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] 500MB free disk space
- [ ] Git installed (optional)
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 📥 Installation Steps with Verification

### Step 1: Install Node.js
**If not already installed:**
- Visit: https://nodejs.org
- Download: LTS version (18+ or newer)
- Install and restart terminal/PowerShell

**Verify:**
\`\`\`bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show 9.0.0 or higher
\`\`\`

### Step 2: Clone/Download Project
**Option A: Git Clone**
\`\`\`bash
git clone https://github.com/yourusername/NAVI-5k.git
cd NAVI-5k
\`\`\`

**Option B: Download ZIP**
- Download from GitHub
- Extract ZIP file
- Open terminal in extracted folder

### Step 3: Install Dependencies
\`\`\`bash
npm install
\`\`\`

**What to expect:**
- Takes 3-5 minutes first time
- Shows progress bar
- Ends with: "added X packages in Y seconds"

**Verify Success:**
- Check for `node_modules` folder (700+MB)
- No error messages in red

### Step 4: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

**What to expect:**
\`\`\`
> next dev
  ▲ Next.js 16.0.0

  ○ Ready in 2.5s

  ▪ Local:        http://localhost:3000
\`\`\`

**Copy the URL:**
- `http://localhost:3000`

### Step 5: Open in Browser
- Paste URL: `http://localhost:3000`
- Watch for boot animation
- You should see:
  1. Splash screen with "NAVI" text
  2. "NaviCo by Ivan Mercado" subtitle
  3. App menu with round blocks

---

## ✅ Post-Installation Verification

### Check 1: Boot Animation
- [ ] Big "NAVI" text appears centered
- [ ] Text animates down to bottom
- [ ] "NaviCo by Ivan Mercado" fades in
- [ ] 3 loading dots pulse at bottom
- [ ] After 4 seconds, app menu appears

### Check 2: App Menu
- [ ] 6 round app buttons visible in grid
- [ ] Apps: Maps, YouTube, Chrome, Camera, Controls, Settings
- [ ] Each button has a label
- [ ] Buttons scale on hover
- [ ] Footer shows company info

### Check 3: Dashboard
Click any app to enter dashboard:
- [ ] Status bar at top shows:
  - Current time
  - Battery voltage
  - Temperature
- [ ] Left navigation visible
- [ ] Navigation buttons work (HOME, CONTROLS, SETTINGS)
- [ ] Camera view displays placeholder

### Check 4: Vehicle Simulator
- [ ] Navigate to: Controls → SIMULATOR tab
- [ ] 4 buttons visible: REVERSE, LEFT TURN, RIGHT TURN, TRIGGER ALARM
- [ ] Buttons toggle on/off (change color when active)
- [ ] Status display shows current state

### Check 5: Camera Switching
In Simulator tab:
- [ ] Click REVERSE → Watch camera change to rear
- [ ] Click LEFT TURN → Camera switches to left PIP
- [ ] Click RIGHT TURN → Camera switches to right PIP
- [ ] Click TRIGGER ALARM → All 4 cameras show (quad view)

### Check 6: Theme Switching
- [ ] Click sun/moon icon (top-right)
- [ ] Dark mode → Light mode smooth transition
- [ ] Colors invert to monochromatic light scheme
- [ ] All text still readable
- [ ] Click again → Back to dark mode

### Check 7: Status Bar Indicators
When vehicle signals are active:
- [ ] REVERSE button active → Red "REV" badge appears
- [ ] LEFT TURN active → Yellow "←TURN" badge
- [ ] RIGHT TURN active → Yellow "TURN→" badge
- [ ] ALARM active → Red pulsing "ALARM" badge

---

## 🔍 Detailed Verification Tests

### Test 1: Boot Animation Timing
\`\`\`bash
# Watch the console output
npm run dev
# Observe timing:
# 0-4 seconds: Splash screen visible
# 4+ seconds: App menu appears
\`\`\`

### Test 2: Responsive Design
- [ ] Resize browser window
- [ ] App adjusts to new size
- [ ] Buttons remain clickable
- [ ] Text remains readable
- [ ] No layout breaks

### Test 3: Touch Interaction
If using touchscreen:
- [ ] Buttons respond to tap
- [ ] No 300ms delay
- [ ] Slider works smoothly
- [ ] Multi-touch not required

### Test 4: Performance
Open DevTools (F12):
- [ ] Console tab: No errors (just warnings OK)
- [ ] Network tab: All files load
- [ ] Performance: 60fps animations
- [ ] Memory: Less than 200MB

### Test 5: Browser Compatibility
Test in multiple browsers:
- [ ] Chrome ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅

---

## ⚠️ Common Issues & Solutions

### Issue: "Port 3000 already in use"
\`\`\`bash
# Solution: Use different port
PORT=3001 npm run dev

# Or kill the process using port 3000
# macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
\`\`\`

### Issue: Blank white/black screen
\`\`\`bash
# Solution 1: Hard refresh
Ctrl + Shift + Delete  # Clear cache
Ctrl + F5             # Hard refresh

# Solution 2: Check console for errors
F12                   # Open DevTools
# Look for red error messages
\`\`\`

### Issue: Animations are choppy/laggy
\`\`\`bash
# Possible causes:
# 1. Browser extensions interfering
#    → Try incognito mode
# 2. GPU acceleration disabled
#    → Check Chrome settings
# 3. Too many background apps
#    → Close unnecessary apps
\`\`\`

### Issue: "npm command not found"
\`\`\`bash
# Node.js not installed
# Visit: https://nodejs.org
# Download and install LTS version
# Restart terminal after installation
\`\`\`

---

## 📊 Expected File Sizes

After installation:

\`\`\`
node_modules/          ~700 MB    ✅ Normal
.next/                 ~300 MB    ✅ Normal (dev build cache)
NAVI-5k/              ~800 MB    ✅ Total project
\`\`\`

If much larger: Run `npm install --clean-cache`

---

## 🎯 Verification Checklist

Print this and check off as you verify:

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] 500MB free disk space

### Installation
- [ ] Project downloaded/cloned
- [ ] `npm install` completed successfully
- [ ] No errors shown
- [ ] node_modules folder exists

### Development Server
- [ ] `npm run dev` started successfully
- [ ] Server running at http://localhost:3000
- [ ] No error messages in terminal

### Boot Animation
- [ ] NAVI text appears centered
- [ ] Text animates downward
- [ ] Subtitle fades in
- [ ] Completes in ~4 seconds

### App Menu
- [ ] 6 round buttons visible
- [ ] All app labels readable
- [ ] Buttons respond to hover
- [ ] Click leads to dashboard

### Dashboard Features
- [ ] Status bar shows time/battery/temp
- [ ] Navigation tabs work
- [ ] Theme toggle works (sun/moon)
- [ ] Camera view displays

### Vehicle Simulator
- [ ] SIMULATOR tab visible in Controls
- [ ] 4 simulation buttons present
- [ ] Buttons toggle on/off
- [ ] Status updates in real-time

### Camera Switching
- [ ] REVERSE → Rear camera
- [ ] LEFT TURN → Left camera PIP
- [ ] RIGHT TURN → Right camera PIP
- [ ] TRIGGER ALARM → Quad view

### Quality Checks
- [ ] No console errors (F12)
- [ ] Animations smooth (60fps)
- [ ] Responsive on all sizes
- [ ] Touch-friendly buttons
- [ ] Fast load times

---

## ✅ You're Ready!

If all checks pass:
✅ Installation successful
✅ All features working
✅ Ready to customize/deploy

### Next Steps:
1. Explore the code
2. Customize colors in `app/globals.css`
3. Change app menu items
4. Deploy to production (`npm run dist`)

---

## 📞 Still Having Issues?

1. **Check Terminal Output**
   - Look for red error messages
   - Google the error message
   - Check GitHub Issues

2. **Check Browser Console (F12)**
   - Click Console tab
   - Look for red errors
   - Check browser compatibility

3. **Verify Paths**
   \`\`\`bash
   # You should be in the project folder:
   # NAVI-5k/
   ls          # macOS/Linux
   dir         # Windows
   # Should show: node_modules, components, app, etc.
   \`\`\`

4. **Try Clean Reinstall**
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   \`\`\`

---

**NAVI © 2025 | NaviCo**

Verification complete? Start building! 🚗✨
