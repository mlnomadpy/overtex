# GitHub Codespaces Installation

This guide is specifically for setting up OverTeX in **GitHub Codespaces**, GitHub's cloud development environment.

## ✨ Why GitHub Codespaces?

- ✅ **Pre-configured**: Node.js and npm already installed
- ✅ **No local setup**: Everything runs in the cloud
- ✅ **Consistent environment**: Same setup for everyone
- ✅ **Access anywhere**: Just need a browser
- ✅ **Free tier**: 60 hours/month for free

---

## 🚀 Quick Start

### Step 1: Create a Codespace

1. Go to the [OverTeX repository](https://github.com/mlnomadpy/overtex)
2. Click the green **"Code"** button
3. Click on the **"Codespaces"** tab
4. Click **"Create codespace on main"**

Wait 1-2 minutes for the environment to build.

### Step 2: Verify Pre-installed Tools

Once your Codespace opens, run these commands in the terminal:

```bash
# Check Node.js (should show v18+ or v20+)
node --version

# Check npm (should show v9+ or v10+)
npm --version

# Check you're in the right directory
pwd
# Should show: /workspaces/overtex
```

### Step 3: Install Dependencies

GitHub Codespaces comes with Node.js and npm, so you just need to install project dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
npm install

# Return to project root
cd ..
```

This takes about 1-2 minutes.

### Step 4: Install LaTeX

GitHub Codespaces runs Ubuntu, so you can install TeX Live:

```bash
# Run the automated installer
sudo bash scripts/install-texlive.sh
```

**Choose Option 1** (minimal install) - this is faster and sufficient for most documents.

The installation takes about 3-5 minutes for minimal, 15-20 minutes for full.

### Step 5: Verify Installation

```bash
# Check LaTeX installation
pdflatex --version
latexmk --version

# Test compilation
cd tex
pdflatex main.tex
# Should create main.pdf
cd ..
```

---

## 🎮 Running OverTeX in Codespaces

GitHub Codespaces requires a specific workflow for running servers:

### Start Both Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

Wait for:
```
🚀 OverTeX API Server running on http://localhost:3000
```

**Terminal 2 (Frontend):**

In VS Code, open a new terminal:
- Click **Terminal** → **New Terminal**
- Or press `` Ctrl+Shift+` ``

Then run:
```bash
cd frontend
npm run dev
```

Wait for:
```
  VITE v7.2.2  ready in 335 ms
  ➜  Local:   http://localhost:5173/
```

### Access the Application

GitHub Codespaces will automatically detect the ports and forward them.

1. **Look for the "Ports" tab** at the bottom of VS Code (next to Terminal)
2. You'll see ports **3000** (backend) and **5173** (frontend)
3. **Click on port 5173** or click the globe icon to "Open in Browser"
4. The application opens in a new tab

**Alternative:** VS Code may show a popup notification saying "Your application running on port 5173 is available" - click **"Open in Browser"**.

---

## 🔧 Codespaces-Specific Tips

### Port Forwarding

Codespaces automatically forwards ports, but you can also:

```bash
# Make ports public (if you want to share)
# Go to Ports tab → Right-click port → Port Visibility → Public
```

### Opening Multiple Terminals

You'll need 2 terminals for backend + frontend:

**Method 1: Split Terminal**
```
1. Open terminal (Ctrl+`)
2. Click the split terminal icon (or Ctrl+Shift+5)
3. Run backend in left pane, frontend in right pane
```

**Method 2: New Terminal Tabs**
```
1. Click Terminal → New Terminal
2. You'll see tabs at the top of the terminal panel
3. Switch between them
```

### Keeping Codespace Alive

Codespaces automatically stops after 30 minutes of inactivity:

- **Keep working** in the browser to stay active
- **Restarting**: Just reopen the codespace - everything is saved
- **Free tier**: 60 hours/month (plenty for development)

### Saving Your Work

Everything is automatically saved in the Codespace. To commit changes:

```bash
git add .
git commit -m "Your changes"
git push
```

---

## 📱 Accessing from Mobile/Tablet

GitHub Codespaces works on mobile devices:

1. Open GitHub on your mobile browser
2. Navigate to your repository
3. Open Codespaces
4. Use the web-based VS Code interface
5. Ports are forwarded the same way

Note: Best experience on tablet or larger screens.

---

## 🛑 Stopping the Application

### Stop Servers
Press `Ctrl+C` in each terminal window.

### Stop Codespace
When you're done:
1. Go to [github.com/codespaces](https://github.com/codespaces)
2. Find your codespace
3. Click "⋮" menu → **"Stop codespace"**

This preserves your work and stops billing.

### Delete Codespace
To completely remove:
1. Go to [github.com/codespaces](https://github.com/codespaces)
2. Click "⋮" menu → **"Delete"**

---

## 💰 Codespaces Pricing (as of 2025)

- **Free Tier**: 
  - 60 core-hours/month
  - 2-core machine = 30 hours of usage
  - 4-core machine = 15 hours of usage

- **After Free Tier**:
  - ~$0.18/hour for 2-core
  - ~$0.36/hour for 4-core

**Tip**: Stop your codespace when not using it to save hours!

---

## 🐛 Troubleshooting

### Port not forwarding automatically

```bash
# Manually forward port
# Ports tab → Add Port → Enter 5173 or 3000
```

### "Cannot connect to backend"

Make sure backend is running on port 3000:
```bash
curl http://localhost:3000/api/health
```

### LaTeX installation fails

```bash
# Make sure you have sudo access (you should in Codespaces)
sudo apt update
sudo apt install -y texlive-latex-base latexmk
```

### Codespace is slow

- Consider upgrading to a larger machine size
- Or delete unused extensions in VS Code
- Or use minimal LaTeX install instead of full

---

## 🔗 Useful Links

- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [VS Code in Browser](https://code.visualstudio.com/docs/editor/vscode-web)
- [Codespaces Pricing](https://github.com/features/codespaces)

---

## Next Steps

- **[Usage Guide](./usage.md)** - How to use OverTeX
- **[Configuration](./configuration.md)** - Customize settings
- **[Back to Installation](./installation.md)** - Other installation methods
