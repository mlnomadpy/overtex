# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### Node.js / npm not found

**Symptom:**
```bash
bash: node: command not found
bash: npm: command not found
```

**Solution:**
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### npm install fails

**Symptom:**
```bash
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER node_modules

# Try again
npm install
```

### LaTeX installation fails

**Symptom:**
```bash
E: Unable to locate package texlive
```

**Solution:**
```bash
# Update package lists
sudo apt update

# Try installation again
sudo bash scripts/install-texlive.sh
```

---

## Server Issues

### Port already in use

**Symptom:**
```bash
Error: listen EADDRINUSE: address already in use :::3000
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution:**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or kill all npm processes
pkill -f "npm run dev"
```

### Backend not starting

**Symptom:**
```bash
# No output or errors immediately
```

**Solution:**
```bash
# Check if dependencies are installed
cd server
ls node_modules/ | head

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

### Frontend not starting

**Symptom:**
```bash
Failed to resolve import
Could not resolve...
```

**Solution:**
```bash
# Clear Vite cache
cd frontend
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

---

## Build Issues

### LaTeX compilation fails

**Symptom:**
```
Build failed: Command failed: latexmk...
```

**Common Causes & Solutions:**

#### 1. Missing LaTeX package
```latex
! LaTeX Error: File `package.sty' not found.
```

**Solution:**
```bash
# Install the package (Ubuntu)
sudo apt-get install texlive-<package-name>

# Or install full distribution
sudo apt-get install texlive-full
```

#### 2. Syntax error in .tex file
```latex
! Undefined control sequence.
```

**Solution:**
- Check the error line number in logs
- Fix the LaTeX syntax
- Common issues:
  - Missing `\begin{document}`
  - Unclosed `{` or `}`
  - Undefined commands
  - Missing `\end{document}`

#### 3. File not found
```latex
! LaTeX Error: File `main.tex' not found.
```

**Solution:**
```bash
# Make sure file exists
ls -la tex/main.tex

# Check file permissions
chmod 644 tex/main.tex
```

### PDF not generating

**Symptom:**
Build succeeds but PDF doesn't appear

**Solution:**
```bash
# Check if PDF was created
ls -la tex/*.pdf

# Check backend logs
# Look for file serving errors

# Check browser console
# Look for network errors

# Try manual compilation
cd tex
pdflatex main.tex
```

---

## Browser/UI Issues

### PDF viewer shows "Failed to load PDF"

**Symptom:**
PDF viewer displays error message

**Solutions:**

#### 1. Backend not running
```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Start backend if needed
cd server && npm run dev
```

#### 2. PDF doesn't exist
```bash
# Check if PDF file exists
ls -la tex/main.pdf

# Build it
curl -X POST http://localhost:3000/api/build \
  -H "Content-Type: application/json" \
  -d '{"filename":"main.tex","outputDir":"tex"}'
```

#### 3. CORS error
Check browser console for:
```
Access to XMLHttpRequest... blocked by CORS policy
```

**Solution:**
```bash
# Verify backend CORS config in server/src/index.ts
# Should allow localhost:5173

# Restart backend
```

### UI not updating after build

**Symptom:**
Build succeeds but PDF doesn't reload

**Solutions:**

```bash
# Hard refresh browser
Ctrl+Shift+R (Linux/Windows)
Cmd+Shift+R (Mac)

# Clear browser cache
# In browser: Ctrl+Shift+Delete

# Check browser console for errors
F12 → Console tab
```

### Logs not displaying

**Symptom:**
Log viewer empty or not expanding

**Solutions:**

```bash
# Check if logs are in response
curl -X POST http://localhost:3000/api/build \
  -H "Content-Type: application/json" \
  -d '{"filename":"main.tex","outputDir":"tex"}' | jq .logs

# Check browser console
# Look for JavaScript errors

# Try clearing logs and rebuilding
```

---

## GitHub Codespaces Issues

### Ports not forwarding

**Symptom:**
Can't access application in browser

**Solution:**
```bash
# Check ports tab in VS Code
# Should show ports 3000 and 5173

# Manually add port if missing
# Ports tab → Add Port → 5173

# Make port public if needed
# Right-click port → Port Visibility → Public
```

### Codespace slow or unresponsive

**Solutions:**

```bash
# 1. Restart Codespace
# GitHub → Codespaces → Menu → Restart

# 2. Use minimal LaTeX install
# Option 1 instead of Option 2

# 3. Upgrade machine type
# GitHub → Codespaces → More options → Change machine type

# 4. Clear caches
cd frontend && npm cache clean --force
cd server && npm cache clean --force
```

### LaTeX installation times out

**Solution:**
```bash
# Use minimal install (faster)
sudo bash scripts/install-texlive.sh
# Choose Option 1

# Or install manually with specific packages
sudo apt-get install texlive-latex-base latexmk
```

---

## Performance Issues

### Slow compilation

**Symptoms:**
- Build takes > 30 seconds
- UI freezes during build

**Solutions:**

```bash
# 1. Use latexmk (default) for smarter rebuilds
# It only recompiles what changed

# 2. Clear auxiliary files
cd tex
rm *.aux *.log *.out *.toc

# 3. Optimize LaTeX document
# - Remove unused packages
# - Simplify complex TikZ diagrams
# - Use draft mode: \documentclass[draft]{article}

# 4. Use minimal LaTeX installation
# Full installation can be slower
```

### High memory usage

**Solutions:**

```bash
# 1. Check memory usage
free -h
top

# 2. Close unused applications

# 3. Restart servers
# Ctrl+C in both terminals
# Start again

# 4. Use minimal LaTeX packages
# Only load what you need
```

---

## File Permission Issues

### Permission denied

**Symptom:**
```bash
EACCES: permission denied, open '/path/to/file'
```

**Solution:**
```bash
# Fix file permissions
chmod 644 tex/main.tex
chmod 755 tex/

# Fix directory permissions
chmod 755 frontend/ server/

# Fix ownership
sudo chown -R $USER:$USER ~/overtex
```

### Can't write to tex/ directory

**Solution:**
```bash
# Make tex/ writable
chmod 755 tex/
chmod 644 tex/*.tex

# Check disk space
df -h
```

---

## Network Issues

### Can't connect to backend

**Symptom:**
```
Failed to fetch
Network Error
```

**Solutions:**

```bash
# 1. Verify backend is running
curl http://localhost:3000/api/health

# 2. Check firewall
sudo ufw status
sudo ufw allow 3000
sudo ufw allow 5173

# 3. Check Vite proxy configuration
# frontend/vite.config.ts should have:
# proxy: { '/api': { target: 'http://localhost:3000' } }

# 4. Restart both servers
```

### Timeout errors

**Symptom:**
```
Build timeout exceeded
```

**Solutions:**

```bash
# 1. Increase timeout in server/src/services/latexService.ts
# buildTimeout = 120000 // 2 minutes

# 2. Simplify LaTeX document

# 3. Check system resources
top
df -h
```

---

## Common LaTeX Errors

### Undefined control sequence

**Example:**
```latex
! Undefined control sequence.
l.10 \mycommand
```

**Solution:**
- Command not defined
- Missing package
- Typo in command name

### Missing $ inserted

**Example:**
```latex
! Missing $ inserted.
```

**Solution:**
- Math mode command used in text mode
- Add `$...$` or `\(...\)` around math

### File not found

**Example:**
```latex
! LaTeX Error: File `image.png' not found.
```

**Solution:**
```bash
# Check file exists
ls tex/image.png

# Use correct path
\includegraphics{image.png}  # if in same directory
\includegraphics{images/image.png}  # if in subdirectory
```

---

## Getting Help

### Debug Information

When asking for help, provide:

```bash
# 1. System information
uname -a
node --version
npm --version
pdflatex --version

# 2. Error messages
# Copy from browser console (F12)
# Copy from terminal

# 3. Build logs
# Export from log viewer

# 4. LaTeX document
# Share your .tex file (if not private)
```

### Where to Get Help

- **GitHub Issues**: https://github.com/mlnomadpy/overtex/issues
- **Discussions**: https://github.com/mlnomadpy/overtex/discussions
- **Stack Overflow**: Tag with `overtex` and `latex`

### Before Asking

1. Check this troubleshooting guide
2. Search existing issues
3. Try the suggested solutions
4. Provide complete error messages

---

## Still Having Issues?

If none of these solutions work:

1. **Create an issue** on GitHub with:
   - Detailed description
   - Steps to reproduce
   - Error messages
   - System information
   - What you've tried

2. **Join discussions** for community help

3. **Check logs**:
   ```bash
   # Frontend logs
   cd frontend && npm run dev 2>&1 | tee frontend.log
   
   # Backend logs
   cd server && npm run dev 2>&1 | tee backend.log
   ```

---

## Next Steps

- **[Usage Guide](./usage.md)** - Learn how to use OverTeX
- **[Configuration](./configuration.md)** - Customize settings
- **[Architecture](./architecture.md)** - Understand how it works
