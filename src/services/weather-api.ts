import type { WeatherData } from '../app.ts';

// Mock weather data for various locations
interface MockLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  weather: {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
  };
}

const MOCK_LOCATIONS: Record<string, MockLocation> = {
  // Australian cities (primary focus)
  'sydney': {
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    weather: {
      temperature: 22,
      condition: 'Partly Cloudy',
      description: 'Partly cloudy with light winds',
      humidity: 65,
      windSpeed: 12,
      windDirection: 45,
      weatherCode: 2
    }
  },
  'melbourne': {
    name: 'Melbourne',
    country: 'Australia',
    latitude: -37.8136,
    longitude: 144.9631,
    weather: {
      temperature: 18,
      condition: 'Cloudy',
      description: 'Overcast with occasional light rain',
      humidity: 78,
      windSpeed: 8,
      windDirection: 225,
      weatherCode: 3
    }
  },
  'brisbane': {
    name: 'Brisbane',
    country: 'Australia',
    latitude: -27.4705,
    longitude: 153.0260,
    weather: {
      temperature: 26,
      condition: 'Sunny',
      description: 'Clear sunny day',
      humidity: 58,
      windSpeed: 15,
      windDirection: 90,
      weatherCode: 0
    }
  },
  'perth': {
    name: 'Perth',
    country: 'Australia',
    latitude: -31.9505,
    longitude: 115.8605,
    weather: {
      temperature: 24,
      condition: 'Clear',
      description: 'Clear skies and warm',
      humidity: 45,
      windSpeed: 20,
      windDirection: 270,
      weatherCode: 0
    }
  },
  'adelaide': {
    name: 'Adelaide',
    country: 'Australia',
    latitude: -34.9285,
    longitude: 138.6007,
    weather: {
      temperature: 20,
      condition: 'Partly Cloudy',
      description: 'Partly cloudy afternoon',
      humidity: 62,
      windSpeed: 10,
      windDirection: 180,
      weatherCode: 2
    }
  },
  // International cities for testing
  'london': {
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    weather: {
      temperature: 12,
      condition: 'Rain',
      description: 'Light rain showers',
      humidity: 85,
      windSpeed: 6,
      windDirection: 135,
      weatherCode: 61
    }
  },
  'new york': {
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    weather: {
      temperature: 8,
      condition: 'Snow',
      description: 'Light snow falling',
      humidity: 72,
      windSpeed: 18,
      windDirection: 315,
      weatherCode: 71
    }
  },
  'tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    weather: {
      temperature: 16,
      condition: 'Partly Cloudy',
      description: 'Partly cloudy and mild',
      humidity: 68,
      windSpeed: 14,
      windDirection: 60,
      weatherCode: 2
    }
  }
};

export class WeatherService {
  async getWeatherByCoordinates(_latitude: number, _longitude: number): Promise<WeatherData> {
    // Simulate API delay
    await this.delay(500);
    
    // Default to Sydney, Australia for coordinate-based requests
    // This simulates a user's location being detected as Australia
    // Note: In a real implementation, we would use latitude/longitude to find the nearest location
    const location = MOCK_LOCATIONS['sydney'];
    
    return this.createWeatherData(location);
  }

  async getWeatherByLocation(location: string): Promise<WeatherData> {
    // Simulate API delay
    await this.delay(800);
    
    const searchTerm = location.toLowerCase().trim();
    
    // Try to find exact match first
    if (MOCK_LOCATIONS[searchTerm]) {
      return this.createWeatherData(MOCK_LOCATIONS[searchTerm]);
    }
    
    // Try partial matches for Australian cities
    for (const [key, data] of Object.entries(MOCK_LOCATIONS)) {
      if (key.includes(searchTerm) || searchTerm.includes(key)) {
        return this.createWeatherData(data);
      }
      
      // Also check if the city name contains the search term
      if (data.name.toLowerCase().includes(searchTerm) || searchTerm.includes(data.name.toLowerCase())) {
        return this.createWeatherData(data);
      }
    }
    
    // If searching for "australia" or similar, default to Sydney
    if (searchTerm.includes('australia') || searchTerm.includes('aus')) {
      return this.createWeatherData(MOCK_LOCATIONS['sydney']);
    }
    
    throw new Error(`Location "${location}" not found. Try searching for: Sydney, Melbourne, Brisbane, Perth, Adelaide, London, New York, or Tokyo.`);
  }

  private createWeatherData(locationData: MockLocation): WeatherData {
    const now = new Date();
    const weather = locationData.weather;
    
    // Calculate feels like temperature
    const feelsLike = this.calculateFeelsLike(weather.temperature, weather.humidity, weather.windSpeed);
    
    return {
      location: locationData.name,
      country: locationData.country,
      temperature: weather.temperature,
      condition: weather.condition,
      description: weather.description,
      feelsLike,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      windDirection: weather.windDirection,
      lastUpdated: now.toISOString()
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateFeelsLike(temperature: number, humidity: number, windSpeed: number): number {
    // Simplified feels-like calculation
    if (temperature >= 27) {
      // Heat index approximation for warm temperatures
      const heatIndex = temperature + (0.1 * humidity) - (0.1 * windSpeed);
      return Math.round(Math.max(heatIndex, temperature));
    } else if (temperature <= 10) {
      // Wind chill approximation for cold temperatures
      const windChill = temperature - (0.2 * windSpeed);
      return Math.round(Math.min(windChill, temperature));
    }
    
    return temperature;
  }
}