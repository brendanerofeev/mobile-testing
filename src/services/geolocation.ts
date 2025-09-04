export class GeolocationService {
  async getCurrentPosition(): Promise<GeolocationPosition> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock Sydney, Australia coordinates
    // This simulates the user being located in Australia
    const mockCoords: GeolocationCoordinates = {
      latitude: -33.8688,
      longitude: 151.2093,
      accuracy: 100,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: function() {
        return {
          latitude: this.latitude,
          longitude: this.longitude,
          accuracy: this.accuracy,
          altitude: this.altitude,
          altitudeAccuracy: this.altitudeAccuracy,
          heading: this.heading,
          speed: this.speed
        };
      }
    };
    
    const mockPosition: GeolocationPosition = {
      coords: mockCoords,
      timestamp: Date.now(),
      toJSON: function() {
        return {
          coords: this.coords.toJSON(),
          timestamp: this.timestamp
        };
      }
    };
    
    return mockPosition;
  }

  async watchPosition(callback: (position: GeolocationPosition) => void): Promise<number> {
    // Get the initial mock position
    const position = await this.getCurrentPosition();
    
    // Call the callback immediately with the mock position
    callback(position);
    
    // Return a fake watch ID
    return 1;
  }

  clearWatch(_watchId: number): void {
    // Mock implementation - nothing to clear
  }
}