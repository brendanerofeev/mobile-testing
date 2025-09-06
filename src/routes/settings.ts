import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('settings-page')
export class SettingsPage extends LitElement {
  @state() private temperatureUnit: 'C' | 'F' = 'C';
  @state() private autoLocation = true;
  @state() private notifications = false;
  @state() private darkMode = false;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, -apple-system, sans-serif;
      color: white;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 3rem;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .settings-content {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .setting-group {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .setting-group:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .setting-label {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      display: block;
    }

    .setting-description {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 1rem;
    }

    .setting-control {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .toggle-group {
      display: flex;
      gap: 0.5rem;
    }

    .toggle-button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: white;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toggle-button.active {
      background: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.6);
    }

    .toggle-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.2);
      transition: 0.4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: rgba(255, 255, 255, 0.4);
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .nav-link {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      margin: 2rem 0.5rem 0 0;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .save-notice {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 1rem;
      text-align: center;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadSettings();
  }

  private loadSettings() {
    const unit = localStorage.getItem('temperature-unit') as 'C' | 'F';
    if (unit) {
      this.temperatureUnit = unit;
    }

    const autoLoc = localStorage.getItem('auto-location');
    if (autoLoc !== null) {
      this.autoLocation = autoLoc === 'true';
    }

    const notif = localStorage.getItem('notifications');
    if (notif !== null) {
      this.notifications = notif === 'true';
    }

    const dark = localStorage.getItem('dark-mode');
    if (dark !== null) {
      this.darkMode = dark === 'true';
    }
  }

  private handleUnitChange(unit: 'C' | 'F') {
    this.temperatureUnit = unit;
    localStorage.setItem('temperature-unit', unit);
  }

  private handleAutoLocationToggle() {
    this.autoLocation = !this.autoLocation;
    localStorage.setItem('auto-location', this.autoLocation.toString());
  }

  private handleNotificationsToggle() {
    this.notifications = !this.notifications;
    localStorage.setItem('notifications', this.notifications.toString());
  }

  private handleDarkModeToggle() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('dark-mode', this.darkMode.toString());
  }

  render() {
    return html`
      <div class="container">
        <header class="header">
          <h1>⚙️ Settings</h1>
        </header>

        <main class="settings-content">
          <div class="setting-group">
            <label class="setting-label">Temperature Unit</label>
            <div class="setting-description">
              Choose your preferred temperature unit for weather display
            </div>
            <div class="setting-control">
              <div class="toggle-group">
                <button 
                  class="toggle-button ${this.temperatureUnit === 'C' ? 'active' : ''}"
                  @click=${() => this.handleUnitChange('C')}
                >
                  Celsius (°C)
                </button>
                <button 
                  class="toggle-button ${this.temperatureUnit === 'F' ? 'active' : ''}"
                  @click=${() => this.handleUnitChange('F')}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">Auto-Location</label>
            <div class="setting-description">
              Automatically detect your location when the app loads
            </div>
            <div class="setting-control">
              <label class="switch">
                <input 
                  type="checkbox" 
                  .checked=${this.autoLocation}
                  @change=${this.handleAutoLocationToggle}
                >
                <span class="slider"></span>
              </label>
              <span>${this.autoLocation ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">Weather Notifications</label>
            <div class="setting-description">
              Receive browser notifications for weather alerts (coming soon)
            </div>
            <div class="setting-control">
              <label class="switch">
                <input 
                  type="checkbox" 
                  .checked=${this.notifications}
                  @change=${this.handleNotificationsToggle}
                  disabled
                >
                <span class="slider"></span>
              </label>
              <span>${this.notifications ? 'Enabled' : 'Disabled'} (Coming Soon)</span>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">Dark Mode</label>
            <div class="setting-description">
              Switch to a darker theme for better viewing in low light (coming soon)
            </div>
            <div class="setting-control">
              <label class="switch">
                <input 
                  type="checkbox" 
                  .checked=${this.darkMode}
                  @change=${this.handleDarkModeToggle}
                  disabled
                >
                <span class="slider"></span>
              </label>
              <span>${this.darkMode ? 'Enabled' : 'Disabled'} (Coming Soon)</span>
            </div>
          </div>

          <div class="save-notice">
            ✅ Settings are automatically saved to your browser's local storage
          </div>

          <nav>
            <a href="/mobile-testing/" class="nav-link">🏠 Home</a>
            <a href="/mobile-testing/about.html" class="nav-link">ℹ️ About</a>
            <a href="/mobile-testing/issues.html" class="nav-link">🐙 Issues</a>
          </nav>
        </main>
      </div>
    `;
  }
}