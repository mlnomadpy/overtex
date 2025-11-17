# OverTeX

> **A local LaTeX live preview web application**  
> Real-time PDF rendering from your local LaTeX environment with a single-click refresh workflow.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Platform](https://img.shields.io/badge/platform-Linux-lightgrey.svg)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/mlnomadpy/overtex.git
cd overtex

# Install dependencies
cd frontend && npm install
cd ../server && npm install
cd ..

# Install LaTeX
sudo bash scripts/install-texlive.sh

# Start servers (2 terminals needed)
cd server && npm run dev      # Terminal 1
cd frontend && npm run dev    # Terminal 2

# Open http://localhost:5173 in your browser
```

---

## 📚 Documentation

### Getting Started
- **[Installation Guide](./docs/installation.md)** - Complete setup instructions
- **[Local Linux Installation](./docs/local-installation.md)** - For Ubuntu/Debian systems
- **[GitHub Codespaces Setup](./docs/github-codespaces.md)** - Cloud development environment
- **[Render Deployment](./docs/render-deployment.md)** - Deploy to production on Render
- **[Usage Guide](./docs/usage.md)** - How to use OverTeX

### Reference
- **[Architecture](./docs/architecture.md)** - System design and data flow
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[Configuration](./docs/configuration.md)** - Customization options

---

## 🎯 Overview

**OverTeX** is a lightweight, local-first web application designed for LaTeX users who want instant visual feedback on their document changes. Instead of manually running `pdflatex` or `latexmk` in a terminal and opening the PDF in an external viewer, OverTeX provides:

- **Browser-based PDF viewer** with embedded rendering (no external PDF apps needed)
- **One-click build trigger** from the UI to compile your LaTeX source
- **Live reload** capability to instantly see changes after compilation
- **Clean, modern interface** built with Vue 3 and shadcn/vue components
- **Local execution** - all processing happens on your machine, no cloud services

This tool is perfect for:
- Writing academic papers, theses, or technical documentation
- Iterating quickly on LaTeX designs and layouts
- Working in environments where you prefer browser-based previews
- Learning LaTeX with immediate visual feedback

---

## ✨ Features

### Core Functionality
- ✅ **Real-time PDF Preview**: View compiled LaTeX documents directly in your browser
- ✅ **Instant Refresh**: Trigger LaTeX compilation with a single button click
- ✅ **Automatic Reload**: PDF viewer updates automatically after successful compilation
- ✅ **Build Status Indicators**: Visual feedback on compilation progress and errors
- ✅ **Compilation Logs**: View LaTeX compiler output for debugging

### Technical Features
- 🚀 **Fast Development Server**: Vite-powered hot module replacement
- 🎨 **Modern UI**: shadcn/vue components with Tailwind CSS styling
- 📱 **Responsive Design**: Works on desktop and tablet screens
- �� **Local-Only**: No external API calls, all data stays on your machine
- ⚙️ **Configurable**: Support for custom LaTeX commands and output paths
- 🛠️ **Developer-Friendly**: Simple setup with `npm run dev`

---

## 📦 Technical Stack

### Frontend
- **Vue 3.5+** - Composition API
- **Vite 7.2+** - Build tool
- **TypeScript 5.9+** - Type safety
- **@vue-pdf-viewer/viewer 3.3+** - PDF rendering
- **Tailwind CSS 3.4+** - Styling
- **shadcn/vue** - UI components

### Backend
- **Node.js 18+** - Runtime
- **Express 5.1+** - API server
- **TypeScript 5.9+** - Type safety
- **child_process** - LaTeX execution

### LaTeX
- **TeX Live** - LaTeX distribution
- **latexmk** - Build automation
- **pdflatex/xelatex/lualatex** - Compilers

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Steps
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [shadcn/vue](https://www.shadcn-vue.com/) - Beautifully designed components
- [@vue-pdf-viewer/viewer](https://github.com/hrynko/vue-pdf-viewer) - Vue 3 PDF viewer
- [TeX Live](https://www.tug.org/texlive/) - Comprehensive TeX system
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📬 Contact

- **GitHub**: [@mlnomadpy](https://github.com/mlnomadpy)
- **Project Link**: [https://github.com/mlnomadpy/overtex](https://github.com/mlnomadpy/overtex)
- **Issues**: [https://github.com/mlnomadpy/overtex/issues](https://github.com/mlnomadpy/overtex/issues)

---

**Made with ❤️ for the LaTeX community**
