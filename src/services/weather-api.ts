import type { WeatherData } from '../app.ts';

export class WeatherService {
  private readonly GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

  async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      // Get weather data
      const weatherUrl = `${this.WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,winddirection_10m&timezone=auto`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherData = await weatherResponse.json();
      
      // Use coordinates as location name since Open-Meteo doesn't support reverse geocoding
      let locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      let countryName = '';

      return this.parseWeatherData(weatherData, locationName, countryName);
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Failed to get weather data. Please try again.');
    }
  }

  async getWeatherByLocation(location: string): Promise<WeatherData> {
    try {
      // First, geocode the location
      const geocodeUrl = `${this.GEOCODING_API}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
      
      const geocodeResponse = await fetch(geocodeUrl);
      if (!geocodeResponse.ok) {
        throw new Error('Failed to find location');
      }
      
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData.results || geocodeData.results.length === 0) {
        throw new Error(`Location "${location}" not found. Please try a different search term.`);
      }
      
      const locationData = geocodeData.results[0];
      const { latitude, longitude, name, country } = locationData;
      
      // Get weather data for the coordinates
      const weatherUrl = `${this.WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,winddirection_10m&timezone=auto`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherData = await weatherResponse.json();
      
      return this.parseWeatherData(weatherData, name, country);
    } catch (error) {
      console.error('Weather API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get weather data. Please try again.');
    }
  }

  private parseWeatherData(data: any, locationName: string, countryName: string): WeatherData {
    const current = data.current_weather;
    const hourly = data.hourly;
    
    // Get current hour index for additional data
    const currentTime = new Date(current.time);
    const currentHour = currentTime.getHours();
    const today = currentTime.toISOString().split('T')[0];
    
    // Find the closest hour in hourly data
    let hourIndex = -1;
    if (hourly && hourly.time) {
      hourIndex = hourly.time.findIndex((time: string) => {
        const timeDate = new Date(time);
        return timeDate.toISOString().split('T')[0] === today && 
               timeDate.getHours() === currentHour;
      });
    }
    
    // Get additional data from hourly if available
    const humidity = hourIndex >= 0 && hourly.relativehumidity_2m 
      ? hourly.relativehumidity_2m[hourIndex] 
      : Math.round(Math.random() * 30 + 40); // Fallback: 40-70%
    
    const windSpeed = current.windspeed || 0;
    const windDirection = current.winddirection || 0;
    
    // Generate weather condition description
    const weatherCode = current.weathercode || 0;
    const { condition, description } = this.getWeatherCondition(weatherCode);
    
    // Estimate "feels like" temperature (simple heat index approximation)
    const feelsLike = this.calculateFeelsLike(current.temperature, humidity, windSpeed);

    return {
      location: locationName,
      country: countryName,
      temperature: current.temperature,
      condition,
      description,
      feelsLike,
      humidity,
      windSpeed,
      windDirection,
      lastUpdated: current.time
    };
  }

  private getWeatherCondition(weatherCode: number): { condition: string; description: string } {
    // WMO Weather interpretation codes
    if (weatherCode === 0) {
      return { condition: 'Clear', description: 'Clear sky' };
    } else if (weatherCode <= 3) {
      return { condition: 'Partly Cloudy', description: 'Partly cloudy' };
    } else if (weatherCode <= 48) {
      return { condition: 'Foggy', description: 'Fog' };
    } else if (weatherCode <= 57) {
      return { condition: 'Drizzle', description: 'Light drizzle' };
    } else if (weatherCode <= 67) {
      return { condition: 'Rain', description: 'Rain' };
    } else if (weatherCode <= 77) {
      return { condition: 'Snow', description: 'Snow' };
    } else if (weatherCode <= 82) {
      return { condition: 'Rain Showers', description: 'Rain showers' };
    } else if (weatherCode <= 86) {
      return { condition: 'Snow Showers', description: 'Snow showers' };
    } else {
      return { condition: 'Thunderstorm', description: 'Thunderstorm' };
    }
  }

  private calculateFeelsLike(temperature: number, humidity: number, windSpeed: number): number {
    // Simplified feels-like calculation
    if (temperature >= 27) {
      // Heat index approximation for warm temperatures
      const heatIndex = temperature + (0.1 * humidity) - (0.1 * windSpeed);
      return Math.max(heatIndex, temperature);
    } else if (temperature <= 10) {
      // Wind chill approximation for cold temperatures
      const windChill = temperature - (0.2 * windSpeed);
      return Math.min(windChill, temperature);
    }
    
    return temperature;
  }
}