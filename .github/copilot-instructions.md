# Construction Site Manager React Application

Construction Site Manager is a React TypeScript application for commercial plumbing site management tools, deployed to GitHub Pages. The app provides equipment tracking, safety checklists, service job booking, and other construction site management features.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup
Available tools and versions:
- Node.js 20.19.4 (required)
- npm 10.8.2
- React 19.1.1 with TypeScript 4.9.5
- Create React App 5.0.1
- Jest testing framework with React Testing Library
- TinyBase for local data storage

### Bootstrap and Initial Setup
For a fresh clone, ALWAYS run these commands in sequence:

1. **Install dependencies**:
   - `npm install` -- takes 45 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
   - This installs all React dependencies including testing libraries and TinyBase

2. **Run tests to verify setup**:
   - `npm test -- --passWithNoTests --watchAll=false` -- takes 4 seconds. Set timeout to 30+ seconds.
   - Should pass all 18 tests (3 test suites)

3. **Build the application**:
   - `npm run build` -- takes 9 seconds. Set timeout to 60+ seconds.
   - Creates optimized production build in `build/` directory

### Development Commands

1. **Start development server**:
   - `npm start` -- takes 10 seconds to start. NEVER CANCEL. Set timeout to 60+ seconds.
   - Opens application at `http://localhost:3000/mobile-testing`
   - Hot reloading enabled for development

2. **Run test suite**:
   - `npm test -- --passWithNoTests --watchAll=false` -- takes 4 seconds. Set timeout to 30+ seconds.
   - Runs Jest tests with React Testing Library
   - Includes 18 tests across 3 test suites

3. **Production build**:
   - `npm run build` -- takes 9 seconds. Set timeout to 60+ seconds.
   - Creates minified, optimized build for deployment
   - Output includes main.js (71.24 kB gzipped) and main.css (3.03 kB gzipped)

4. **Deploy to GitHub Pages**:
   - `npm run deploy` -- takes 15 seconds. Set timeout to 60+ seconds.
   - Automatically runs build first, then deploys to gh-pages branch

### Code Quality and Linting

1. **TypeScript compilation check**:
   - `npx tsc --noEmit` -- takes 3 seconds. Set timeout to 30+ seconds.
   - Validates TypeScript types without emitting files

2. **ESLint checking**:
   - `npx eslint src/ --ext .ts,.tsx` -- takes 2 seconds. Set timeout to 30+ seconds.
   - **NOTE**: Currently has 22 linting errors in test files (Testing Library best practices)
   - Main application code passes linting - errors are only in test files

## Validation

### Manual Testing Requirements
ALWAYS manually validate any changes by running through these complete user scenarios:

1. **Home Page Navigation**:
   - Start development server: `npm start`
   - Navigate to `http://localhost:3000/mobile-testing`
   - Verify all 7 tool cards are visible (Equipment Tracker, Safety Checklist, Service Job Booking, etc.)
   - Verify "Construction Site Manager" title and subtitle are displayed

2. **Equipment Tracker Functionality**:
   - Click on Equipment Tracker tool card
   - Verify equipment status summary shows: 2 Available, 2 In Use, 1 Maintenance
   - Verify 5 equipment items are listed with details (location, last checked, operator)
   - Test back button navigation to home page

3. **Safety Checklist Interactive Features**:
   - Click on Safety Checklist tool card
   - Verify completion status shows initially 67% (6 of 9 items)
   - Click on an unchecked safety item (e.g., "Steel-toed boots on all personnel")
   - Verify item becomes checked and completion percentage updates to 78% (7 of 9 items)
   - Verify data persistence by refreshing page and checking item remains checked
   - Test back button navigation to home page

4. **Service Job Booking Form**:
   - Click on Service Job Booking tool card
   - Verify all form fields are present: Client, M2 Area, Chemicals, Summary, Access, Lighting, Labour Hours, Voice Input
   - Test "Add Equipment" button functionality
   - Test back button navigation to home page

### Always Run Before Committing
- `npm test -- --passWithNoTests --watchAll=false` -- verify all 18 tests pass
- `npm run build` -- verify production build succeeds without errors
- `npx tsc --noEmit` -- verify TypeScript compilation passes
- Manual validation of at least one complete user scenario (Equipment Tracker or Safety Checklist)

## Common Tasks

### Repository Structure
Current repository root contains:
```
.
..
.git/
.github/
  copilot-instructions.md
  workflows/
    ci.yml (runs tests and build validation)
    deploy.yml (deploys to GitHub Pages)
LICENSE
README.md
package.json
package-lock.json
tsconfig.json
.gitignore
public/
  index.html
  manifest.json
  favicon.ico
  logo192.png
  logo512.png
  robots.txt
src/
  App.tsx (main application component)
  App.test.tsx (main application tests)
  App.css
  index.tsx (React app entry point)
  index.css
  components/
    HomePage.tsx (main dashboard)
    EquipmentTracker.tsx (equipment management)
    SafetyChecklist.tsx (safety compliance)
    ServiceJobBooking.tsx (service job forms)
    [corresponding .css and .test.tsx files]
  database/
    store.ts (TinyBase data management)
    store.test.ts (database tests)
  setupTests.ts
  reportWebVitals.ts
  react-app-env.d.ts
build/ (after npm run build)
node_modules/ (after npm install)
```

### Package.json Key Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build", 
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Timing Expectations and Timeouts
**CRITICAL**: Always use these timeout values to prevent premature cancellation:

- `npm install`: 45 seconds (timeout: 90+ seconds) - NEVER CANCEL
- `npm start`: 10 seconds to start (timeout: 60+ seconds) - NEVER CANCEL  
- `npm test`: 4 seconds (timeout: 30+ seconds)
- `npm run build`: 9 seconds (timeout: 60+ seconds)
- `npm run deploy`: 15 seconds (timeout: 60+ seconds)
- `npx tsc --noEmit`: 3 seconds (timeout: 30+ seconds)
- `npx eslint`: 2 seconds (timeout: 30+ seconds)

### Technology Stack Details

**React Application**:
- React 19.1.1 with functional components and hooks
- TypeScript 4.9.5 for type safety
- Create React App 5.0.1 for build tooling
- Configured for GitHub Pages deployment at `/mobile-testing` path

**Data Management**:
- TinyBase 6.6.0 for local data storage with localStorage persistence
- Equipment tracking with status management
- Safety checklist with completion tracking
- Service job booking with form data management

**Testing Framework**:
- Jest with React Testing Library
- 18 comprehensive tests covering UI interactions and data management
- Tests include navigation, state management, and user workflows
- Console logging visible during tests (database initialization messages)

**Styling and UI**:
- Custom CSS with responsive design
- Card-based interface for tool selection
- Blue theme with white cards
- Mobile-friendly responsive layout

### Known Issues and Current State
- ESLint shows 22 errors in test files related to Testing Library best practices (not blocking)
- Main application code passes all TypeScript and functional tests
- Application fully functional with interactive features working correctly
- All user scenarios validated and working properly

### Live Deployment
- Application is deployed to GitHub Pages at: https://brendanerofeev.github.io/mobile-testing
- Automatic deployment triggered by pushes to main branch
- CI pipeline validates tests and build before deployment

### Best Practices for Development
1. **Always run full test suite** before making changes
2. **Use development server** for iterative development with hot reloading
3. **Test interactive features manually** after changes (safety checklist toggles, navigation)
4. **Validate production build** before committing changes
5. **Follow React/TypeScript patterns** established in existing code
6. **Test data persistence** by refreshing browser during development
7. **Use TypeScript compilation check** to catch type errors early

## Emergency Procedures
If any command hangs or appears frozen:
- DO NOT cancel npm install (takes 45 seconds) or npm start (takes 10 seconds to start)
- Wait at least the documented timeout period before investigating
- For development server issues, check if port 3000 is available
- For build issues, ensure build/ directory is clean and retry