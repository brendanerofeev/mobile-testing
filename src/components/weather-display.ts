import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WeatherData } from '../app.ts';

@customElement('weather-display')
export class WeatherDisplay extends LitElement {
  @property({ type: Object }) weatherData?: WeatherData;
  @property({ type: String }) unit: 'C' | 'F' = 'C';

  static styles = css`
    :host {
      display: block;
    }

    .weather-card {
      color: white;
    }

    .location {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-align: center;
    }

    .main-weather {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .temperature {
      font-size: 4rem;
      font-weight: bold;
      line-height: 1;
    }

    .condition {
      text-align: right;
    }

    .condition-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .condition-text {
      font-size: 1.2rem;
      text-transform: capitalize;
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .detail-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
    }

    .detail-label {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.5rem;
    }

    .detail-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .last-updated {
      text-align: center;
      font-size: 0.9rem;
      opacity: 0.7;
      margin-top: 2rem;
    }
  `;

  private convertTemperature(celsius: number): number {
    return this.unit === 'F' ? (celsius * 9/5) + 32 : celsius;
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

  private getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  render() {
    if (!this.weatherData) {
      return html`<div>No weather data available</div>`;
    }

    const temp = Math.round(this.convertTemperature(this.weatherData.temperature));
    const feelsLike = Math.round(this.convertTemperature(this.weatherData.feelsLike));
    const icon = this.getWeatherIcon(this.weatherData.condition);
    const windDir = this.getWindDirection(this.weatherData.windDirection);

    return html`
      <div class="weather-card">
        <div class="location">
          📍 ${this.weatherData.location}, ${this.weatherData.country}
        </div>

        <div class="main-weather">
          <div class="temperature">
            ${temp}°${this.unit}
          </div>
          
          <div class="condition">
            <div class="condition-icon">${icon}</div>
            <div class="condition-text">${this.weatherData.condition}</div>
          </div>
        </div>

        <div class="weather-details">
          <div class="detail-item">
            <div class="detail-label">Feels like</div>
            <div class="detail-value">${feelsLike}°${this.unit}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">Humidity</div>
            <div class="detail-value">${this.weatherData.humidity}%</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">Wind Speed</div>
            <div class="detail-value">${this.weatherData.windSpeed} km/h</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">Wind Direction</div>
            <div class="detail-value">${windDir} (${this.weatherData.windDirection}°)</div>
          </div>
        </div>

        <div class="last-updated">
          Last updated: ${this.formatDateTime(this.weatherData.lastUpdated)}
        </div>
      </div>
    `;
  }
}