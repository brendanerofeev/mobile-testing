import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/weather-display.ts';
import './components/location-input.ts';
import './components/loading-spinner.ts';
import { WeatherService } from './services/weather-api.ts';
import { GeolocationService } from './services/geolocation.ts';

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
  @state() private weatherData: WeatherData | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private temperatureUnit: 'C' | 'F' = 'C';
  @state() private currentLocation = '';

  private weatherService = new WeatherService();
  private geolocationService = new GeolocationService();

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, -apple-system, sans-serif;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 3rem;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
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
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .weather-section {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
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

  render() {
    return html`
      <div class="container">
        <header class="header">
          <h1>🌤️ Weather Now</h1>
          <p>Get current weather information for any location</p>
        </header>

        <main class="main-content">
          <section class="search-section">
            <location-input
              .currentLocation=${this.currentLocation}
              @location-search=${this.handleLocationSearch}
            ></location-input>
            
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
            ` : ''}

            ${!this.weatherData && !this.loading && !this.error ? html`
              <div style="text-align: center; color: rgba(255,255,255,0.7); padding: 2rem;">
                <h3>Welcome to Weather Now!</h3>
                <p>Search for a location above or allow location access to see current weather.</p>
              </div>
            ` : ''}
          </section>
        </main>
      </div>
    `;
  }
}