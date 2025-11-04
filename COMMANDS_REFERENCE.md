# NAVI - Quick Commands Reference

## 🚀 Getting Started (Copy & Paste Ready)

### First Time Setup
\`\`\`bash
# Clone the project
git clone https://github.com/navico/navi-infotainment.git
cd navi-infotainment

# Install dependencies (5-10 minutes)
npm install

# Start development
npm run dev

# Open browser
# Visit: http://localhost:3000
\`\`\`

---

## 📝 Development Commands

### Start Development Server
\`\`\`bash
# Next.js + Electron (full app)
npm run dev

# Next.js only (browser, port 3000)
npm run dev:next

# Electron only (requires Next.js running)
npm run dev:electron
\`\`\`

### Building
\`\`\`bash
# Production build
npm run build

# Build Next.js only
npm run build:next

# Build Electron main process
npm run build:electron

# Build preload script
npm run build:preload
\`\`\`

### Quality Checks
\`\`\`bash
# Lint code (ESLint)
npm run lint

# Type checking (TypeScript)
npm run type-check

# Both lint and type-check
npm run lint && npm run type-check
\`\`\`

---

## 📦 Distribution & Packaging

### Create Distributable Packages
\`\`\`bash
# Build everything + create packages (5-10 minutes)
npm run dist

# Outputs to: dist/ folder
# - Windows: NAVI Setup 1.0.0.exe, NAVI-1.0.0.exe
# - macOS: NAVI-1.0.0.dmg, NAVI-1.0.0-mac.zip
# - Linux: navi-1.0.0.AppImage, navi-1.0.0.deb
\`\`\`

### Manual Steps
\`\`\`bash
# Only pack (don't rebuild)
npm run pack

# Start production server (after build)
npm start
\`\`\`

---

## 🔧 Troubleshooting Commands

### Clear Cache & Reinstall
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Remove dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install
\`\`\`

### Port Management
\`\`\`bash
# Find process using port 3000 (macOS/Linux)
lsof -i :3000

# Kill process by PID (macOS/Linux)
kill -9 <PID>

# Kill by port (Windows PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use utility to kill port
npx kill-port 3000
\`\`\`

### Check System
\`\`\`bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check all npm scripts
npm run

# List installed packages
npm list

# List outdated packages
npm outdated
\`\`\`

---

## 🌍 Environment Management

### Create Environment File
\`\`\`bash
# Create .env.local
echo "NEXT_PUBLIC_SERIAL_PORT=COM3" > .env.local
echo "NEXT_PUBLIC_BAUD_RATE=115200" >> .env.local
\`\`\`

### View Environment Variables
\`\`\`bash
# Show all environment variables
node -e "console.log(process.env)"

# In development
echo $NEXT_PUBLIC_SERIAL_PORT  # macOS/Linux
echo %NEXT_PUBLIC_SERIAL_PORT%  # Windows
\`\`\`

---

## 📂 File Management

### Project Structure
\`\`\`bash
# List all files (macOS/Linux)
ls -la

# List with tree view
tree -L 2

# Show disk usage
du -sh .

# Count lines of code
wc -l app/**/*.tsx components/**/*.tsx
\`\`\`

---

## 🔍 Development Tools

### Browser DevTools
\`\`\`
F12              - Open DevTools
Ctrl+Shift+I     - Inspect element
Ctrl+Shift+C     - Select element
Ctrl+Shift+M     - Toggle device mode
Ctrl+Shift+J     - Open console
Ctrl+R           - Refresh page
Ctrl+Shift+R     - Hard refresh
\`\`\`

### Electron DevTools
\`\`\`
F12              - Open DevTools (same as browser)
Ctrl+R           - Reload
Ctrl+Shift+R     - Hard reload
Ctrl+Shift+Delete- Clear cache
\`\`\`

---

## 🛠️ Maintenance Commands

### Update Dependencies
\`\`\`bash
# Check for outdated packages
npm outdated

# Update to latest versions
npm update

# Specific package
npm install <package>@latest

# Check for security issues
npm audit

# Fix security issues
npm audit fix
\`\`\`

### Cleaning
\`\`\`bash
# Remove build artifacts
rm -rf .next dist out

# Remove cache
rm -rf node_modules/.cache

# Remove logs
rm -f *.log

# Full clean
npm run clean
\`\`\`

---

## 📊 Performance & Monitoring

### Build Analysis
\`\`\`bash
# Analyze bundle size
npm run build -- --analyze

# Check TypeScript compilation time
time npm run type-check

# Monitor during development
npm run dev -- --debug
\`\`\`

### Performance Testing
\`\`\`bash
# Using Lighthouse (if installed)
npx lighthouse http://localhost:3000

# Performance audit
npm run build -- --debug
\`\`\`

---

## 🔐 Security Commands

### Security Audit
\`\`\`bash
# Check for vulnerabilities
npm audit

# Check specific package
npm view <package> vulnerabilities

# Generate security report
npm audit --json > security-report.json
\`\`\`

### Code Quality
\`\`\`bash
# ESLint check
npm run lint

# ESLint fix (auto-fix)
npm run lint -- --fix

# TypeScript strict check
npm run type-check -- --strict
\`\`\`

---

## 📝 Git Commands (If Using Git)

### Basic Git
\`\`\`bash
# Clone repository
git clone <url>

# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your message"

# Push to remote
git push origin main

# Pull latest
git pull
\`\`\`

### Useful Git Commands
\`\`\`bash
# View commit history
git log --oneline

# Create new branch
git checkout -b feature/name

# Switch branch
git checkout main

# View diff
git diff

# Stash changes
git stash

# Apply stashed changes
git stash pop
\`\`\`

---

## 🎯 Common Workflows

### Daily Development
\`\`\`bash
# 1. Update code
# ... edit files ...

# 2. Start development
npm run dev

# 3. Check for issues
npm run type-check

# 4. Commit changes (if using git)
git add .
git commit -m "Update features"
\`\`\`

### Before Deployment
\`\`\`bash
# 1. Check code quality
npm run lint
npm run type-check

# 2. Build for production
npm run build

# 3. Create packages
npm run dist

# 4. Test packages
# ... test .exe, .dmg, or .AppImage ...
\`\`\`

### Emergency Troubleshooting
\`\`\`bash
# Stop everything
# Ctrl+C in terminal

# Kill all Node processes (be careful!)
killall node  # macOS/Linux
taskkill /F /IM node.exe  # Windows

# Clear everything
rm -rf node_modules package-lock.json .next dist
npm cache clean --force
npm install
npm run dev
\`\`\`

---

## 💡 Pro Tips

### Faster Development
\`\`\`bash
# Use browser-only for UI work (faster)
npm run dev:next

# Only rebuild what changed
npm run build:next  # Instead of npm run build
\`\`\`

### Debugging
\`\`\`bash
# Add debug to Chrome
node --inspect npm run dev

# Use VS Code debugger
# Create .vscode/launch.json with debug config
\`\`\`

### Performance Optimization
\`\`\`bash
# Monitor bundle size
npm run build -- --analyze

# Check runtime performance
# Open DevTools → Performance tab
# Record and analyze
\`\`\`

---

## 📞 Help Commands

### Get Help
\`\`\`bash
# NPM help
npm help

# Specific command help
npm help run
npm help install

# Version info
npm -v
node -v

# List all available scripts
npm run
\`\`\`

### Documentation Links
\`\`\`
Next.js Docs: https://nextjs.org/docs
React Docs: https://react.dev
Tailwind CSS: https://tailwindcss.com/docs
Electron: https://electronjs.org/docs
TypeScript: https://www.typescriptlang.org/docs
\`\`\`

---

## 🔗 Useful Resources

### Development
- Local: `http://localhost:3000`
- DevTools: Press `F12`
- React DevTools: Browser extension
- Redux DevTools: Browser extension

### Deployment Checklist
\`\`\`bash
✅ npm run lint          # Code quality
✅ npm run type-check    # Type safety
✅ npm run build         # Production build
✅ npm run dist          # Create packages
✅ Test packages
✅ Document changes
✅ Commit to git
✅ Deploy
\`\`\`

---

## 🎉 Success Indicators

### Development is Running
\`\`\`
✔ Ready on http://localhost:3000
electron: ready
\`\`\`

### Build is Successful
\`\`\`
✓ Built successfully
dist/ folder created with packages
\`\`\`

### Types are Valid
\`\`\`
✓ No type errors
\`\`\`

### Tests Pass
\`\`\`
✓ All tests passed
\`\`\`

---

**Quick Command Cheat Sheet**

| Command | Purpose | Time |
|---------|---------|------|
| `npm install` | Setup | 5-10m |
| `npm run dev` | Develop | instant |
| `npm run build` | Compile | 1-2m |
| `npm run dist` | Package | 3-5m |
| `npm run lint` | Check quality | 10-30s |
| `npm run type-check` | Verify types | 5-10s |

---

**Built with ❤️ by NaviCo**  
**Founded by Ivan Mercado | Est. 2025**
