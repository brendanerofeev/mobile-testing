import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './components/weather-display.ts';
import './components/location-input.ts';
import './components/loading-spinner.ts';
import { WeatherService } from './services/weather-api.ts';
import { GeolocationService } from './services/geolocation.ts';
import { GitHubService } from './services/github.ts';

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  lastUpdated: string;
}

@customElement('weather-app')
export class WeatherApp extends LitElement {
  // Use simple properties to avoid conflicts
  private _weatherData: WeatherData | null = null;
  private _loading = false;
  private _error: string | null = null;
  private _temperatureUnit: 'C' | 'F' = 'C';
  private _currentLocation = '';

  private weatherService = new WeatherService();
  private geolocationService = new GeolocationService();
  private githubService = GitHubService.getInstance();

  get weatherData() { return this._weatherData; }
  set weatherData(value: WeatherData | null) {
    this._weatherData = value;
    this.requestUpdate();
  }

  get loading() { return this._loading; }
  set loading(value: boolean) {
    this._loading = value;
    this.requestUpdate();
  }

  get error() { return this._error; }
  set error(value: string | null) {
    this._error = value;
    this.requestUpdate();
  }

  get temperatureUnit() { return this._temperatureUnit; }
  set temperatureUnit(value: 'C' | 'F') {
    this._temperatureUnit = value;
    this.requestUpdate();
  }

  get currentLocation() { return this._currentLocation; }
  set currentLocation(value: string) {
    this._currentLocation = value;
    this.requestUpdate();
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
      width: calc(100% - 2rem);
    }

    @media (min-width: 480px) {
      .container {
        padding: 2rem 1.5rem;
        width: calc(100% - 3rem);
      }
    }

    @media (min-width: 768px) {
      .container {
        padding: 2rem;
        width: 100%;
      }
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;
      position: relative;
    }

    .header h1 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    @media (min-width: 480px) {
      .header {
        margin-bottom: 3rem;
        padding: 0;
      }
      
      .header h1 {
        font-size: 3rem;
      }
    }

    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }

    .github-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 2rem;
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.9rem;
    }

    .github-status.connected {
      background: rgba(34, 197, 94, 0.15);
      border-color: rgba(34, 197, 94, 0.3);
    }

    .github-status.disconnected {
      background: rgba(156, 163, 175, 0.15);
      border-color: rgba(156, 163, 175, 0.3);
    }

    .status-icon {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .github-status {
        position: static;
        display: inline-flex;
        margin-bottom: 1rem;
      }
    }

    .main-content {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr;
    }

    .search-section {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 1rem;
    }

    .weather-section {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    @media (min-width: 480px) {
      .search-section,
      .weather-section {
        padding: 2rem;
      }
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.5rem;
      padding: 1rem;
      color: #fca5a5;
      text-align: center;
      margin-bottom: 1rem;
    }

    .unit-toggle {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .unit-toggle button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: white;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .unit-toggle button.active {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .unit-toggle button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    @media (min-width: 768px) {
      .main-content {
        grid-template-columns: 1fr 2fr;
      }
    }

    /* Input field improvements for mobile */
    input[type="text"] {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      padding: 0.75rem;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 0.5rem;
      background: rgba(255,255,255,0.1);
      color: white;
      font-size: 1rem;
      margin: 0;
    }

    input[type="text"]::placeholder {
      color: rgba(255,255,255,0.7);
    }

    input[type="text"]:focus {
      outline: none;
      border-color: rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.15);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadCachedData();
    this.requestLocation();
  }

  private loadCachedData() {
    const cached = localStorage.getItem('weather-data');
    if (cached) {
      try {
        this.weatherData = JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached weather data:', e);
      }
    }

    const unit = localStorage.getItem('temperature-unit') as 'C' | 'F';
    if (unit) {
      this.temperatureUnit = unit;
    }
  }

  private async requestLocation() {
    try {
      this.loading = true;
      this.error = null;
      
      const position = await this.geolocationService.getCurrentPosition();
      const weatherData = await this.weatherService.getWeatherByCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      
      this.weatherData = weatherData;
      this.currentLocation = weatherData.location;
      localStorage.setItem('weather-data', JSON.stringify(weatherData));
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to get weather data';
      console.error('Location/Weather error:', error);
    } finally {
      this.loading = false;
    }
  }

  private async handleLocationSearch(event: CustomEvent<string>) {
    const location = event.detail.trim();
    if (!location) return;

    try {
      this.loading = true;
      this.error = null;
      
      const weatherData = await this.weatherService.getWeatherByLocation(location);
      this.weatherData = weatherData;
      this.currentLocation = weatherData.location;
      localStorage.setItem('weather-data', JSON.stringify(weatherData));
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to get weather data';
      console.error('Search error:', error);
    } finally {
      this.loading = false;
    }
  }

  private handleUnitChange(unit: 'C' | 'F') {
    this.temperatureUnit = unit;
    localStorage.setItem('temperature-unit', unit);
  }

  private async handleLocationRequest() {
    await this.requestLocation();
  }

  private getWeatherIcon(condition: string): string {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return '☀️';
    } else if (lowerCondition.includes('cloud')) {
      return '☁️';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return '🌧️';
    } else if (lowerCondition.includes('snow')) {
      return '❄️';
    } else if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) {
      return '⛈️';
    } else if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) {
      return '🌫️';
    } else if (lowerCondition.includes('wind')) {
      return '💨';
    }
    
    return '🌤️';
  }

  render() {
    const githubStatus = this.githubService.getConnectionStatus();
    
    return html`
      <div class="container">
        <header class="header">
          <div class="github-status ${githubStatus}">
            <span class="status-icon">
              ${githubStatus === 'connected' ? '🟢' : '⚫'}
            </span>
            <span>GitHub ${githubStatus === 'connected' ? 'Connected' : 'Offline'}</span>
          </div>
          <h1>🌤️ Weather Now</h1>
          <p>Get current weather information for any location</p>
        </header>

        <main class="main-content">
          <section class="search-section">
            <location-input
              .currentLocation=${this.currentLocation}
              @location-search=${this.handleLocationSearch}
              @location-request=${this.handleLocationRequest}
            ></location-input>
            
            <!-- Fallback search input to demonstrate functionality -->
            <div style="margin-bottom: 1rem;">
              <input 
                type="text" 
                placeholder="Try: Sydney, Melbourne, Brisbane, Perth, Adelaide..."
                style="width: 100%; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 0.5rem; background: rgba(255,255,255,0.1); color: white; font-size: 1rem;"
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      this.handleLocationSearch({ detail: input.value.trim() } as CustomEvent<string>);
                    }
                  }
                }}
              />
              <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button @click=${() => this.handleLocationSearch({ detail: 'sydney' } as CustomEvent<string>)} 
                        style="padding: 0.25rem 0.5rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 0.25rem; color: white; cursor: pointer;">
                  Sydney
                </button>
                <button @click=${() => this.handleLocationSearch({ detail: 'melbourne' } as CustomEvent<string>)} 
                        style="padding: 0.25rem 0.5rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 0.25rem; color: white; cursor: pointer;">
                  Melbourne
                </button>
                <button @click=${() => this.handleLocationSearch({ detail: 'brisbane' } as CustomEvent<string>)} 
                        style="padding: 0.25rem 0.5rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 0.25rem; color: white; cursor: pointer;">
                  Brisbane
                </button>
                <button @click=${() => this.requestLocation()} 
                        style="padding: 0.25rem 0.5rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 0.25rem; color: white; cursor: pointer;">
                  📍 My Location (Australia)
                </button>
              </div>
            </div>
            
            <div class="unit-toggle">
              <button 
                class=${this.temperatureUnit === 'C' ? 'active' : ''}
                @click=${() => this.handleUnitChange('C')}
              >
                °C
              </button>
              <button 
                class=${this.temperatureUnit === 'F' ? 'active' : ''}
                @click=${() => this.handleUnitChange('F')}
              >
                °F
              </button>
            </div>
          </section>

          <section class="weather-section">
            ${this.error ? html`
              <div class="error-message">
                ${this.error}
              </div>
            ` : ''}

            ${this.loading ? html`
              <loading-spinner></loading-spinner>
            ` : ''}

            ${this.weatherData && !this.loading ? html`
              <weather-display
                .weatherData=${this.weatherData}
                .unit=${this.temperatureUnit}
              ></weather-display>
              
              <!-- Fallback display to show mock data is working -->
              <div style="color: white; background: rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.5rem; margin-top: 1rem;">
                <h3 style="margin: 0 0 1rem 0; text-align: center;">
                  📍 ${this.weatherData.location}, ${this.weatherData.country}
                </h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <div style="font-size: 2.5rem; font-weight: bold;">
                    ${this.temperatureUnit === 'C' ? this.weatherData.temperature : Math.round((this.weatherData.temperature * 9/5) + 32)}°${this.temperatureUnit}
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 1.5rem;">${this.getWeatherIcon(this.weatherData.condition)}</div>
                    <div>${this.weatherData.condition}</div>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; font-size: 0.9rem;">
                  <div>Humidity: ${this.weatherData.humidity}%</div>
                  <div>Wind: ${this.weatherData.windSpeed} km/h</div>
                  <div>Feels like: ${this.temperatureUnit === 'C' ? this.weatherData.feelsLike : Math.round((this.weatherData.feelsLike * 9/5) + 32)}°${this.temperatureUnit}</div>
                </div>
              </div>
            ` : ''}

            ${!this.weatherData && !this.loading && !this.error ? html`
              <div style="text-align: center; color: rgba(255,255,255,0.7); padding: 2rem;">
                <h3>Welcome to Weather Now!</h3>
                <p>Search for a location above or allow location access to see current weather.</p>
              </div>
            ` : ''}
          </section>
        </main>

        <footer style="text-align: center; margin-top: 2rem; padding: 1rem;">
          <nav style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="/mobile-testing/about.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem; transition: all 0.2s;">
              ℹ️ About
            </a>
            <a href="/mobile-testing/settings.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem; transition: all 0.2s;">
              ⚙️ Settings
            </a>
            <a href="/mobile-testing/issues.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border-radius: 0.5rem; transition: all 0.2s;">
              🐙 Issues
            </a>
          </nav>
        </footer>
      </div>
    `;
  }
}