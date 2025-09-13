import React, { useState } from 'react';
import './SafetyChecklist.css';

interface SafetyItem {
  id: string;
  category: string;
  item: string;
  completed: boolean;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

interface SafetyChecklistProps {
  onBack: () => void;
}

const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ onBack }) => {
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>([
    {
      id: 'safety001',
      category: 'Personal Protective Equipment',
      item: 'All workers wearing hard hats',
      completed: true,
      priority: 'high'
    },
    {
      id: 'safety002',
      category: 'Personal Protective Equipment',
      item: 'Safety glasses/goggles in use',
      completed: true,
      priority: 'high'
    },
    {
      id: 'safety003',
      category: 'Personal Protective Equipment',
      item: 'Steel-toed boots on all personnel',
      completed: false,
      priority: 'high'
    },
    {
      id: 'safety004',
      category: 'Work Area Safety',
      item: 'Work area properly ventilated',
      completed: true,
      priority: 'medium'
    },
    {
      id: 'safety005',
      category: 'Work Area Safety',
      item: 'Emergency exits clearly marked and accessible',
      completed: true,
      priority: 'high'
    },
    {
      id: 'safety006',
      category: 'Equipment Safety',
      item: 'All power tools inspected before use',
      completed: false,
      priority: 'high'
    },
    {
      id: 'safety007',
      category: 'Equipment Safety',
      item: 'First aid kit accessible and stocked',
      completed: true,
      priority: 'medium'
    },
    {
      id: 'safety008',
      category: 'Hazard Management',
      item: 'Confined space entry permits checked',
      completed: false,
      priority: 'high'
    },
    {
      id: 'safety009',
      category: 'Hazard Management',
      item: 'Chemical storage properly labeled',
      completed: true,
      priority: 'medium'
    }
  ]);

  const toggleItem = (id: string) => {
    setSafetyItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const groupedItems = safetyItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SafetyItem[]>);

  const completedCount = safetyItems.filter(item => item.completed).length;
  const totalCount = safetyItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const getPriorityColor = (priority: SafetyItem['priority']) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="safety-checklist">
      <header className="tool-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <div className="header-content">
          <h1>⚠️ Safety Checklist</h1>
          <p>Daily safety inspections and compliance</p>
        </div>
      </header>

      <div className="safety-progress">
        <div className="progress-card">
          <h3>Completion Status</h3>
          <div className="progress-stats">
            <div className="progress-circle">
              <span className="progress-percentage">{completionPercentage}%</span>
              <span className="progress-text">Complete</span>
            </div>
            <div className="progress-details">
              <p><strong>{completedCount}</strong> of <strong>{totalCount}</strong> items completed</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="checklist-content">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="safety-category">
            <h2 className="category-title">{category}</h2>
            <div className="safety-items">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`safety-item ${item.completed ? 'completed' : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="item-content">
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}} // Handled by parent onClick
                        className="safety-checkbox"
                      />
                      <span className="checkmark"></span>
                    </div>
                    <div className="item-details">
                      <span className="item-text">{item.item}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="item-notes">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="checklist-actions">
        <button className="action-button primary">
          Submit Safety Report
        </button>
        <button className="action-button secondary">
          Add Note
        </button>
      </div>

      <div className="placeholder-note">
        <p><em>This is a placeholder tool. Full functionality will be implemented in future versions.</em></p>
      </div>
    </div>
  );
};

export default SafetyChecklist;