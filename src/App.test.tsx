import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorage Testing App', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('renders LocalStorage testing interface', () => {
    render(<App />);
    
    expect(screen.getByText('LocalStorage Testing Tool')).toBeInTheDocument();
    expect(screen.getByText('Test your browser\'s localStorage functionality with these interactive tests')).toBeInTheDocument();
    expect(screen.getByText('Run All Tests')).toBeInTheDocument();
    expect(screen.getByText('About LocalStorage')).toBeInTheDocument();
  });

  test('run all tests button works', async () => {
    render(<App />);
    
    const runButton = screen.getByText('Run All Tests');
    fireEvent.click(runButton);
    
    // Button should show running state
    expect(screen.getByText('Running Tests...')).toBeInTheDocument();
    
    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText('Test Results')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Check that test results are displayed
    expect(screen.getByText('Basic Storage Test')).toBeInTheDocument();
    expect(screen.getByText('Storage Persistence Test')).toBeInTheDocument();
    expect(screen.getByText('Large Data Test')).toBeInTheDocument();
    expect(screen.getByText('Edge Cases Test')).toBeInTheDocument();
    expect(screen.getByText('Clear Functionality Test')).toBeInTheDocument();
  });

  test('clear results button works', async () => {
    render(<App />);
    
    // Run tests first
    const runButton = screen.getByText('Run All Tests');
    fireEvent.click(runButton);
    
    // Wait for tests to complete - all tests should be finished (no more "pending")
    await waitFor(() => {
      expect(screen.getByText('Test Results')).toBeInTheDocument();
      // Check that button is no longer showing "Running Tests..."
      expect(screen.getByText('Run All Tests')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Now clear results
    const clearButton = screen.getByText('Clear Results');
    expect(clearButton).not.toBeDisabled();
    fireEvent.click(clearButton);
    
    // Test results should be gone immediately since it's just state change
    expect(screen.queryByText('Test Results')).not.toBeInTheDocument();
  });

  test('localStorage basic functionality works', () => {
    // Test that our localStorage mock works
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    
    localStorage.removeItem('test');
    expect(localStorage.getItem('test')).toBeNull();
    
    localStorage.setItem('test1', 'value1');
    localStorage.setItem('test2', 'value2');
    localStorage.clear();
    expect(localStorage.getItem('test1')).toBeNull();
    expect(localStorage.getItem('test2')).toBeNull();
  });
});
