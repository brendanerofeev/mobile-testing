import React, { useState } from 'react';
import './EquipmentTracker.css';

interface Equipment {
  id: string;
  name: string;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  lastChecked: string;
  operator?: string;
}

interface EquipmentTrackerProps {
  onBack: () => void;
}

const EquipmentTracker: React.FC<EquipmentTrackerProps> = ({ onBack }) => {
  const [equipment] = useState<Equipment[]>([
    {
      id: 'eq001',
      name: 'Pipe Threading Machine',
      status: 'available',
      location: 'Storage Yard A',
      lastChecked: '2024-01-20 08:30'
    },
    {
      id: 'eq002',
      name: 'Drain Snake - 50ft',
      status: 'in-use',
      location: 'Floor 3 - Unit 312',
      lastChecked: '2024-01-20 07:15',
      operator: 'Mike Johnson'
    },
    {
      id: 'eq003',
      name: 'Pipe Cutter - Large',
      status: 'maintenance',
      location: 'Maintenance Shop',
      lastChecked: '2024-01-19 16:45'
    },
    {
      id: 'eq004',
      name: 'Pressure Test Kit',
      status: 'available',
      location: 'Tool Trailer',
      lastChecked: '2024-01-20 06:00'
    },
    {
      id: 'eq005',
      name: 'Welding Equipment',
      status: 'in-use',
      location: 'Basement - Main Line',
      lastChecked: '2024-01-20 09:00',
      operator: 'David Smith'
    }
  ]);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'available': return '#27ae60';
      case 'in-use': return '#f39c12';
      case 'maintenance': return '#e74c3c';
      case 'offline': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: Equipment['status']) => {
    switch (status) {
      case 'available': return 'Available';
      case 'in-use': return 'In Use';
      case 'maintenance': return 'Maintenance';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="equipment-tracker">
      <header className="tool-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <div className="header-content">
          <h1>🔧 Equipment Tracker</h1>
          <p>Track and manage construction equipment</p>
        </div>
      </header>

      <div className="equipment-stats">
        <div className="stat-card available">
          <h3>{equipment.filter(eq => eq.status === 'available').length}</h3>
          <p>Available</p>
        </div>
        <div className="stat-card in-use">
          <h3>{equipment.filter(eq => eq.status === 'in-use').length}</h3>
          <p>In Use</p>
        </div>
        <div className="stat-card maintenance">
          <h3>{equipment.filter(eq => eq.status === 'maintenance').length}</h3>
          <p>Maintenance</p>
        </div>
      </div>

      <div className="equipment-list">
        <h2>Equipment Status</h2>
        {equipment.map((item) => (
          <div key={item.id} className="equipment-card">
            <div className="equipment-header">
              <h3>{item.name}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {getStatusText(item.status)}
              </span>
            </div>
            <div className="equipment-details">
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Last Checked:</strong> {item.lastChecked}</p>
              {item.operator && (
                <p><strong>Operator:</strong> {item.operator}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="placeholder-note">
        <p><em>This is a placeholder tool. Full functionality will be implemented in future versions.</em></p>
      </div>
    </div>
  );
};

export default EquipmentTracker;