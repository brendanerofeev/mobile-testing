import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      color: white;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 1.1rem;
      opacity: 0.9;
      text-align: center;
    }

    .skeleton-weather {
      width: 100%;
      max-width: 400px;
      margin-top: 2rem;
    }

    .skeleton-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-title {
      height: 2rem;
      width: 60%;
      margin: 0 auto 1.5rem auto;
    }

    .skeleton-temp {
      height: 4rem;
      width: 50%;
      margin: 0 auto 1rem auto;
    }

    .skeleton-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .skeleton-detail {
      height: 3rem;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;

  render() {
    return html`
      <div class="spinner"></div>
      <div class="loading-text">Getting weather data...</div>
      
      <div class="skeleton-weather">
        <div class="skeleton-item skeleton-title"></div>
        <div class="skeleton-item skeleton-temp"></div>
        <div class="skeleton-details">
          <div class="skeleton-item skeleton-detail"></div>
          <div class="skeleton-item skeleton-detail"></div>
          <div class="skeleton-item skeleton-detail"></div>
          <div class="skeleton-item skeleton-detail"></div>
        </div>
      </div>
    `;
  }
}