# Mobile Testing

[![CI](https://github.com/brendanerofeev/mobile-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/brendanerofeev/mobile-testing/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/brendanerofeev/mobile-testing/actions/workflows/deploy.yml/badge.svg)](https://github.com/brendanerofeev/mobile-testing/actions/workflows/deploy.yml)

A Progressive Web App (PWA) built with Vite, TypeScript, and Lit for weather information.

## 🚀 Live Demo

The application is automatically deployed to GitHub Pages: [https://brendanerofeev.github.io/mobile-testing/](https://brendanerofeev.github.io/mobile-testing/)

## 🛠️ Development

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Build for GitHub Pages
npm run build:gh-pages

# Preview production build
npm run preview
```

## 🔄 CI/CD

This project uses GitHub Actions for continuous integration and deployment:

### CI Workflow (`.github/workflows/ci.yml`)
- Runs on every push and pull request to main branch
- Performs TypeScript type checking
- Builds the project to validate compilation
- Tests both regular and GitHub Pages builds

### Deploy Workflow (`.github/workflows/deploy.yml`)
- Runs on pushes to main branch only
- Performs full CI validation before deployment
- Automatically deploys to GitHub Pages
- Uses proper concurrency controls to prevent conflicts

### Scripts Available

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build for GitHub Pages deployment
- `npm run typecheck` - Run TypeScript type checking
- `npm run ci` - Run full CI pipeline (typecheck + build)
- `npm run ci:gh-pages` - Run CI pipeline for GitHub Pages
- `npm run preview` - Preview production build locally

## 📦 Technologies

- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Lit** - Web Components library
- **PWA** - Progressive Web App capabilities
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static hosting

## 🔧 Architecture

This is a Single Page Application (SPA) that functions as a Progressive Web App with:

- Service Worker for offline capabilities
- Web App Manifest for install prompts
- TypeScript for type safety
- Modern ES modules
- Automatic code splitting

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.