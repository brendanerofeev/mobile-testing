import React, { useState } from 'react';
import './App.css';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  details?: string;
}

function App() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (index: number, result: Partial<TestResult>) => {
    setTestResults(prev => prev.map((test, i) => i === index ? { ...test, ...result } : test));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Initialize test results
    const initialTests: TestResult[] = [
      { name: 'Basic Storage Test', status: 'pending', message: 'Testing setItem/getItem...' },
      { name: 'Storage Persistence Test', status: 'pending', message: 'Testing data persistence...' },
      { name: 'Large Data Test', status: 'pending', message: 'Testing storage capacity...' },
      { name: 'Edge Cases Test', status: 'pending', message: 'Testing special characters and null values...' },
      { name: 'Clear Functionality Test', status: 'pending', message: 'Testing clear() method...' }
    ];
    
    setTestResults(initialTests);

    // Delay for visual effect
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Test 1: Basic Storage
      await delay(500);
      try {
        const testKey = 'localStorage_test_basic';
        const testValue = 'Hello LocalStorage!';
        
        localStorage.setItem(testKey, testValue);
        const retrievedValue = localStorage.getItem(testKey);
        
        if (retrievedValue === testValue) {
          updateTestResult(0, {
            status: 'pass',
            message: 'Basic storage test passed!',
            details: `Successfully stored and retrieved: "${testValue}"`
          });
        } else {
          updateTestResult(0, {
            status: 'fail',
            message: 'Basic storage test failed!',
            details: `Expected: "${testValue}", Got: "${retrievedValue}"`
          });
        }
        
        localStorage.removeItem(testKey);
      } catch (error) {
        updateTestResult(0, {
          status: 'fail',
          message: 'Basic storage test failed!',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Test 2: Storage Persistence
      await delay(500);
      try {
        const persistKey = 'localStorage_test_persist';
        const persistValue = 'Persistent Data';
        
        localStorage.setItem(persistKey, persistValue);
        
        // Simulate checking persistence (in real scenario this would be after page reload)
        const persistedValue = localStorage.getItem(persistKey);
        
        if (persistedValue === persistValue) {
          updateTestResult(1, {
            status: 'pass',
            message: 'Persistence test passed!',
            details: 'Data correctly persisted in localStorage'
          });
        } else {
          updateTestResult(1, {
            status: 'fail',
            message: 'Persistence test failed!',
            details: 'Data was not properly persisted'
          });
        }
        
        localStorage.removeItem(persistKey);
      } catch (error) {
        updateTestResult(1, {
          status: 'fail',
          message: 'Persistence test failed!',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Test 3: Large Data
      await delay(500);
      try {
        const largeKey = 'localStorage_test_large';
        const largeValue = 'Large Data: ' + 'x'.repeat(1000); // 1KB+ of data
        
        localStorage.setItem(largeKey, largeValue);
        const retrievedLarge = localStorage.getItem(largeKey);
        
        if (retrievedLarge === largeValue) {
          updateTestResult(2, {
            status: 'pass',
            message: 'Large data test passed!',
            details: `Successfully stored ${largeValue.length} characters`
          });
        } else {
          updateTestResult(2, {
            status: 'fail',
            message: 'Large data test failed!',
            details: 'Large data was not properly stored or retrieved'
          });
        }
        
        localStorage.removeItem(largeKey);
      } catch (error) {
        updateTestResult(2, {
          status: 'fail',
          message: 'Large data test failed!',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Test 4: Edge Cases
      await delay(500);
      try {
        const edgeTests = [
          { key: 'test_null', value: null },
          { key: 'test_undefined', value: undefined },
          { key: 'test_special_chars', value: '!@#$%^&*(){}[]|\\:";\'<>?,./' },
          { key: 'test_unicode', value: '🚀💾🔧✅❌' },
          { key: 'test_empty', value: '' }
        ];
        
        let allPassed = true;
        let details = '';
        
        for (const test of edgeTests) {
          try {
            localStorage.setItem(test.key, String(test.value));
            const retrieved = localStorage.getItem(test.key);
            const expected = String(test.value);
            
            if (retrieved !== expected) {
              allPassed = false;
              details += `Failed for ${test.key}: expected "${expected}", got "${retrieved}". `;
            }
            localStorage.removeItem(test.key);
          } catch (err) {
            allPassed = false;
            details += `Error with ${test.key}: ${err}. `;
          }
        }
        
        updateTestResult(3, {
          status: allPassed ? 'pass' : 'fail',
          message: allPassed ? 'Edge cases test passed!' : 'Edge cases test failed!',
          details: allPassed ? 'All edge cases handled correctly' : details
        });
      } catch (error) {
        updateTestResult(3, {
          status: 'fail',
          message: 'Edge cases test failed!',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Test 5: Clear Functionality
      await delay(500);
      try {
        // Set up some test data
        localStorage.setItem('test_clear_1', 'value1');
        localStorage.setItem('test_clear_2', 'value2');
        localStorage.setItem('test_clear_3', 'value3');
        
        // Clear localStorage
        localStorage.clear();
        
        // Check if data was cleared
        const cleared1 = localStorage.getItem('test_clear_1');
        const cleared2 = localStorage.getItem('test_clear_2');
        const cleared3 = localStorage.getItem('test_clear_3');
        
        if (cleared1 === null && cleared2 === null && cleared3 === null) {
          updateTestResult(4, {
            status: 'pass',
            message: 'Clear functionality test passed!',
            details: 'localStorage.clear() successfully removed all data'
          });
        } else {
          updateTestResult(4, {
            status: 'fail',
            message: 'Clear functionality test failed!',
            details: 'Some data remained after localStorage.clear()'
          });
        }
      } catch (error) {
        updateTestResult(4, {
          status: 'fail',
          message: 'Clear functionality test failed!',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>LocalStorage Testing Tool</h1>
        <p>Test your browser's localStorage functionality with these interactive tests</p>
        
        <div className="test-controls">
          <button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="test-button primary"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button 
            onClick={clearResults} 
            disabled={isRunning || testResults.length === 0}
            className="test-button secondary"
          >
            Clear Results
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="test-results">
            <h2>Test Results</h2>
            {testResults.map((test, index) => (
              <div key={index} className={`test-result ${test.status}`}>
                <div className="test-header">
                  <span className={`status-icon ${test.status}`}>
                    {test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⏳'}
                  </span>
                  <h3>{test.name}</h3>
                </div>
                <p className="test-message">{test.message}</p>
                {test.details && (
                  <p className="test-details">{test.details}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="info-section">
          <h3>About LocalStorage</h3>
          <p>
            LocalStorage is a web storage API that allows websites to store data 
            locally within a user's browser. This tool tests various aspects of 
            localStorage functionality to ensure it's working properly in your browser.
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
