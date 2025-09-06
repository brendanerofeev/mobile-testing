import { describe, it, expect } from 'vitest'

// Utility functions to test
function formatTemperature(temp: number, unit: 'C' | 'F'): string {
  return `${Math.round(temp)}°${unit}`
}

function validateLocation(location: string): boolean {
  return location.trim().length > 0 && location.trim().length <= 100
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Tests
describe('Utility Functions', () => {
  describe('formatTemperature', () => {
    it('should format temperature in Celsius', () => {
      expect(formatTemperature(20.5, 'C')).toBe('21°C')
      expect(formatTemperature(0, 'C')).toBe('0°C')
      expect(formatTemperature(-5.7, 'C')).toBe('-6°C')
    })

    it('should format temperature in Fahrenheit', () => {
      expect(formatTemperature(68.9, 'F')).toBe('69°F')
      expect(formatTemperature(32, 'F')).toBe('32°F')
      expect(formatTemperature(100.1, 'F')).toBe('100°F')
    })
  })

  describe('validateLocation', () => {
    it('should validate correct locations', () => {
      expect(validateLocation('New York')).toBe(true)
      expect(validateLocation('Paris')).toBe(true)
      expect(validateLocation('A')).toBe(true)
    })

    it('should reject invalid locations', () => {
      expect(validateLocation('')).toBe(false)
      expect(validateLocation('   ')).toBe(false)
      expect(validateLocation('a'.repeat(101))).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateLocation(' Valid ')).toBe(true)
      expect(validateLocation('a'.repeat(100))).toBe(true)
    })
  })

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
      expect(capitalizeFirst('WORLD')).toBe('World')
      expect(capitalizeFirst('tEST')).toBe('Test')
    })

    it('should handle edge cases', () => {
      expect(capitalizeFirst('')).toBe('')
      expect(capitalizeFirst('a')).toBe('A')
      expect(capitalizeFirst('A')).toBe('A')
    })
  })
})