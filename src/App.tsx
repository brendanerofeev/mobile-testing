import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import EquipmentTracker from './components/EquipmentTracker';
import SafetyChecklist from './components/SafetyChecklist';
import ServiceJobBooking from './components/ServiceJobBooking';
import { initializeDatabase } from './database/store';
import './App.css';

type CurrentView = 'home' | 'equipment-tracker' | 'safety-checklist' | 'service-job-booking' | 'crew-management' | 'material-inventory' | 'progress-reports' | 'quality-control';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('home');

  // Initialize database on app startup
  useEffect(() => {
    initializeDatabase();
  }, []);

  const navigateToTool = (toolId: string) => {
    setCurrentView(toolId as CurrentView);
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'equipment-tracker':
        return <EquipmentTracker onBack={navigateToHome} />;
      case 'safety-checklist':
        return <SafetyChecklist onBack={navigateToHome} />;
      case 'service-job-booking':
        return <ServiceJobBooking onBack={navigateToHome} />;
      case 'crew-management':
      case 'material-inventory':
      case 'progress-reports':
      case 'quality-control':
        return (
          <div className="placeholder-tool">
            <header className="tool-header">
              <button className="back-button" onClick={navigateToHome}>
                ← Back to Home
              </button>
              <div className="header-content">
                <h1>🚧 Coming Soon</h1>
                <p>This tool is currently under development</p>
              </div>
            </header>
            <div className="placeholder-content">
              <p>This tool will be available in a future update.</p>
              <p>For now, please explore the Equipment Tracker and Safety Checklist tools.</p>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigateToTool={navigateToTool} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;
