import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('about-page')
export class AboutPage extends LitElement {
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

    .content {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      line-height: 1.6;
    }

    .content h2 {
      color: #fff;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    .content h2:first-child {
      margin-top: 0;
    }

    .api-attribution {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1rem 0;
    }

    .nav-link {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      margin: 1rem 0.5rem 0 0;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }
  `;

  render() {
    return html`
      <div class="container">
        <header class="header">
          <h1>🌤️ About Weather Now</h1>
        </header>

        <main class="content">
          <h2>About This App</h2>
          <p>
            Weather Now is a modern, static site weather application built with cutting-edge web technologies. 
            It provides real-time weather information for any location worldwide with a beautiful, responsive 
            interface that works seamlessly across all devices.
          </p>

          <h2>Features</h2>
          <ul>
            <li>🌍 Global weather data for any city or location</li>
            <li>📍 Automatic location detection with user permission</li>
            <li>🌡️ Temperature units toggle (Celsius/Fahrenheit)</li>
            <li>💨 Comprehensive weather details (humidity, wind, feels-like temperature)</li>
            <li>📱 Fully responsive design for mobile and desktop</li>
            <li>⚡ Lightning-fast static site generation</li>
            <li>🔄 Progressive web app capabilities</li>
            <li>🎨 Beautiful glassmorphism design with smooth animations</li>
          </ul>

          <h2>Technology Stack</h2>
          <ul>
            <li><strong>Framework:</strong> Lit Web Components with TypeScript</li>
            <li><strong>Build Tool:</strong> Vite with PWA plugin</li>
            <li><strong>Styling:</strong> CSS-in-JS with custom properties</li>
            <li><strong>Deployment:</strong> GitHub Pages with automated CI/CD</li>
            <li><strong>Architecture:</strong> Static Site Generation (SSG)</li>
          </ul>

          <div class="api-attribution">
            <h2>Weather Data Attribution</h2>
            <p>
              Weather data is provided by <strong>Open-Meteo</strong>, a free weather API that doesn't require 
              API keys. Open-Meteo provides accurate, real-time weather information from national weather 
              services worldwide.
            </p>
            <p>
              🌐 <a href="https://open-meteo.com" target="_blank" style="color: #87ceeb;">Open-Meteo.com</a> - 
              Free Weather API for non-commercial use
            </p>
          </div>

          <h2>Privacy & Performance</h2>
          <p>
            This app respects your privacy and is designed for optimal performance:
          </p>
          <ul>
            <li>🔒 No personal data collection or tracking</li>
            <li>🚀 Static site generation for ultra-fast loading</li>
            <li>💾 Local storage for preferences and caching</li>
            <li>🌐 Works offline with service worker caching</li>
            <li>🔐 No API keys exposed (using free, public APIs)</li>
          </ul>

          <nav>
            <a href="/mobile-testing/" class="nav-link">🏠 Home</a>
            <a href="/mobile-testing/settings.html" class="nav-link">⚙️ Settings</a>
            <a href="/mobile-testing/issues.html" class="nav-link">🐙 Issues</a>
          </nav>
        </main>
      </div>
    `;
  }
}