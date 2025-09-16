import React from 'react';
import './HomePage.css';

interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  onClick: () => void;
}

interface HomePageProps {
  onNavigateToTool: (toolId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToTool }) => {
  const tools: Tool[] = [
    {
      id: 'equipment-tracker',
      name: 'Equipment Tracker',
      icon: '🔧',
      description: 'Track and manage construction equipment',
      onClick: () => onNavigateToTool('equipment-tracker')
    },
    {
      id: 'safety-checklist',
      name: 'Safety Checklist',
      icon: '⚠️',
      description: 'Daily safety inspections and compliance',
      onClick: () => onNavigateToTool('safety-checklist')
    },
    {
      id: 'service-job-booking',
      name: 'Service Job Booking',
      icon: '📋',
      description: 'Book and manage service jobs',
      onClick: () => onNavigateToTool('service-job-booking')
    },
    // Additional tools can be added here for future expansion
    {
      id: 'crew-management',
      name: 'Crew Management',
      icon: '👷',
      description: 'Manage crew schedules and assignments',
      onClick: () => onNavigateToTool('crew-management')
    },
    {
      id: 'material-inventory',
      name: 'Material Inventory',
      icon: '📦',
      description: 'Track materials and supplies',
      onClick: () => onNavigateToTool('material-inventory')
    },
    {
      id: 'progress-reports',
      name: 'Progress Reports',
      icon: '📊',
      description: 'Daily progress tracking and reporting',
      onClick: () => onNavigateToTool('progress-reports')
    },
    {
      id: 'quality-control',
      name: 'Quality Control',
      icon: '✅',
      description: 'Quality inspections and documentation',
      onClick: () => onNavigateToTool('quality-control')
    }
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Construction Site Manager</h1>
        <p>Commercial Plumbing Site Management Tools</p>
      </header>
      
      <div className="tools-grid">
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            className="tool-card"
            onClick={tool.onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                tool.onClick();
              }
            }}
          >
            <div className="tool-icon">{tool.icon}</div>
            <h3 className="tool-name">{tool.name}</h3>
            <p className="tool-description">{tool.description}</p>
          </div>
        ))}
      </div>
      
      <footer className="home-footer">
        <p>Select a tool to get started with site management</p>
      </footer>
    </div>
  );
};

export default HomePage;