import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('location-input')
export class LocationInput extends LitElement {
  @property({ type: String }) currentLocation = '';
  @state() private inputValue = '';

  static styles = css`
    :host {
      display: block;
    }

    .search-container {
      margin-bottom: 1.5rem;
    }

    .search-form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      backdrop-filter: blur(10px);
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .search-input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.15);
    }

    .search-button {
      padding: 0.75rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }

    .search-button:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .search-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .current-location {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      text-align: center;
    }

    .examples {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
      text-align: center;
      margin-top: 0.5rem;
    }

    .location-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .action-button {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }

    .action-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;

  private handleSubmit(e: Event) {
    e.preventDefault();
    const location = this.inputValue.trim();
    if (location) {
      this.dispatchEvent(new CustomEvent('location-search', {
        detail: location,
        bubbles: true
      }));
      // Keep the input value for user convenience
    }
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.inputValue = target.value;
  }

  private requestLocation() {
    if ('geolocation' in navigator) {
      this.dispatchEvent(new CustomEvent('location-request', {
        bubbles: true
      }));
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  private searchCurrentLocation() {
    if (this.currentLocation) {
      this.inputValue = this.currentLocation;
      // Also update the actual input element
      const input = this.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
      if (input) {
        input.value = this.currentLocation;
      }
      this.dispatchEvent(new CustomEvent('location-search', {
        detail: this.currentLocation,
        bubbles: true
      }));
    }
  }

  render() {
    return html`
      <div class="search-container">
        <form class="search-form" @submit=${this.handleSubmit}>
          <input
            type="text"
            class="search-input"
            placeholder="Enter city name or postcode..."
            @input=${this.handleInputChange}
          />
          <button 
            type="submit" 
            class="search-button"
            ?disabled=${!this.inputValue.trim()}
          >
            🔍 Search
          </button>
        </form>

        ${this.currentLocation ? html`
          <div class="current-location">
            📍 Current: ${this.currentLocation}
          </div>
        ` : ''}

        <div class="examples">
          Try: "London", "New York", "Sydney", "Tokyo", or "SW1A 1AA"
        </div>

        <div class="location-actions">
          <button class="action-button" @click=${this.requestLocation}>
            📍 Use My Location
          </button>
          ${this.currentLocation ? html`
            <button class="action-button" @click=${this.searchCurrentLocation}>
              🔄 Refresh Current
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }
}