# Mobile Testing Repository

Mobile testing is a repository designed for mobile application testing frameworks and tools. Currently, this is a minimal repository with an Apache 2.0 license, ready for mobile testing project development.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup
Available tools in the environment:
- Node.js 20.19.4
- npm 10.8.2  
- yarn (latest)
- Gradle 9.0.0
- Java/OpenJDK 17.0.16
- Fastlane (latest)

### Bootstrap and Initial Setup
For a fresh clone or new mobile testing project:

1. **Initialize npm project** (if package.json doesn't exist):
   - `npm init -y` -- takes <1 second
   
2. **Install basic testing dependencies**:
   - `npm install --save-dev jest` -- takes 30 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
   - `npm install --save-dev @testing-library/react-native` (for React Native projects)
   - `npm install --save-dev detox` (for end-to-end testing) -- takes 15 seconds. Set timeout to 30+ seconds.

### React Native Mobile Testing Setup
To create and test React Native projects:

1. **Install React Native CLI globally**:
   - `npm install --global @react-native-community/cli` -- takes 15 seconds. Set timeout to 30+ seconds.

2. **Create new React Native project**:
   - `npx @react-native-community/cli@latest init ProjectName` -- takes 45 seconds. NEVER CANCEL. Set timeout to 90+ seconds.

3. **Run React Native tests**:
   - `cd ProjectName && npm test` -- takes 3 seconds for basic tests
   - Tests use Jest framework and run basic snapshot tests

### Build and Test Commands

1. **Basic npm test execution**:
   - `npm test` -- takes <1 second for minimal setup, 3 seconds for React Native projects
   - Default test command runs Jest test suites

2. **Install development dependencies**:
   - Any `npm install --save-dev [package]` command takes 10-30 seconds depending on package size
   - NEVER CANCEL npm install commands. Set timeout to 60+ seconds minimum.

3. **Linting and formatting** (when configured):
   - `npm run lint` -- typical mobile projects take 5-15 seconds
   - `npm run format` -- typical mobile projects take 2-10 seconds

### Flutter Mobile Testing Setup
**WARNING**: Flutter installation currently fails in this environment due to SDK download issues. Do not attempt Flutter setup until this is resolved.

### Native Android/iOS Testing
For native mobile testing:

1. **Gradle builds** (Android projects):
   - `gradle build` -- can take 2-15 minutes depending on project size. NEVER CANCEL. Set timeout to 30+ minutes.
   - `gradle test` -- takes 1-10 minutes. NEVER CANCEL. Set timeout to 20+ minutes.

2. **Java compilation**:
   - Available with OpenJDK 17.0.16
   - Basic compilation takes seconds to minutes

## Validation

### Manual Testing Requirements
Always manually validate any mobile testing changes by:

1. **For React Native projects**:
   - Create a test project: `npx @react-native-community/cli@latest init ValidationProject`
   - Run the test suite: `cd ValidationProject && npm test`
   - Verify the test passes and takes expected time (2-5 seconds)

2. **For Jest-based testing**:
   - Install Jest: `npm install --save-dev jest`
   - Create a simple test file in `__tests__/` directory
   - Run `npm test` and verify tests execute properly

3. **For end-to-end testing with Detox**:
   - Install Detox: `npm install --save-dev detox`
   - Verify installation completes without errors
   - Configure Detox according to project needs

### Always Run Before Committing
- `npm test` -- verify all tests pass
- `npm run lint` (if configured) -- verify code style compliance
- `npm run build` (if configured) -- verify builds complete successfully

## Common Tasks

### Repository Structure
Current repository root contains:
```
.
..
.git/
.github/
  copilot-instructions.md
LICENSE
package.json (after npm init)
node_modules/ (after npm install)
```

### Package.json Template
After running `npm init -y`, the generated package.json:
```json
{
  "name": "mobile-testing",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

### Timing Expectations and Timeouts
**CRITICAL**: Always use these timeout values to prevent premature cancellation:

- `npm init`: <1 second (timeout: 30 seconds)
- `npm install jest`: 30 seconds (timeout: 90 seconds) 
- `npm install detox`: 15 seconds (timeout: 60 seconds)
- React Native CLI install: 15 seconds (timeout: 60 seconds)
- React Native project creation: 45 seconds (timeout: 120 seconds)
- Basic npm test: <1-3 seconds (timeout: 30 seconds)
- Gradle builds: 2-15 minutes (timeout: 30+ minutes) - NEVER CANCEL
- Complex mobile builds: 10-45 minutes (timeout: 60+ minutes) - NEVER CANCEL

### Framework-Specific Notes

**React Native**:
- Always use `@react-native-community/cli` instead of deprecated `react-native` command
- Default project includes Jest test setup
- Metro bundler may take additional time on first run

**Jest Testing**:
- Standard testing framework for JavaScript/TypeScript mobile projects
- Supports snapshot testing, unit testing, and integration testing
- Fast execution for basic test suites

**Detox E2E Testing**:
- Requires additional device/emulator setup for full functionality
- Installation is quick but configuration may require additional steps
- Best for testing complete user workflows

### Known Issues and Limitations
- Flutter SDK download currently fails - do not attempt Flutter setup
- Android emulator not available in this environment
- iOS simulator not available in this environment
- Physical device testing not possible in this environment

### Best Practices for Mobile Testing
1. **Always validate installation steps** before documenting them
2. **Use appropriate timeouts** for mobile build processes
3. **Test across multiple frameworks** when applicable (React Native, Flutter, native)
4. **Focus on automated testing** since manual device testing is limited
5. **Use snapshot testing** for UI component validation
6. **Implement unit tests** for business logic
7. **Add integration tests** for critical user paths

## Emergency Procedures
If any command hangs or appears frozen:
- DO NOT cancel commands that typically take minutes (builds, installs)
- Wait at least the documented timeout period before investigating
- Check system resources if unexpected delays occur
- Prefer starting fresh over attempting to recover from partial states