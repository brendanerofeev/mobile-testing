import { describe, it, expect, beforeEach } from 'vitest'
import { setupCounter } from './counter'

describe('setupCounter', () => {
  let button: HTMLButtonElement

  beforeEach(() => {
    button = document.createElement('button')
    document.body.appendChild(button)
  })

  it('should initialize counter with 0', () => {
    setupCounter(button)
    expect(button.innerHTML).toBe('count is 0')
  })

  it('should increment counter when clicked', () => {
    setupCounter(button)
    button.click()
    expect(button.innerHTML).toBe('count is 1')
    
    button.click()
    expect(button.innerHTML).toBe('count is 2')
  })

  it('should handle multiple clicks correctly', () => {
    setupCounter(button)
    
    // Click 5 times
    for (let i = 0; i < 5; i++) {
      button.click()
    }
    
    expect(button.innerHTML).toBe('count is 5')
  })
})