import { createStore } from 'tinybase/store';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';

// Define the database schema interfaces
export interface Equipment {
  id: string;
  name: string;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  lastChecked: string;
  operator?: string;
}

export interface SafetyItem {
  id: string;
  category: string;
  item: string;
  completed: boolean;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

// Create the main store
export const store = createStore();

// Create local persister for browser localStorage
export const persister = createLocalPersister(store, 'construction-site-db');

// Initialize database with initial data
export const initializeDatabase = () => {
  try {
    // Try to load from localStorage first
    const savedData = localStorage.getItem('construction-site-db');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData && Object.keys(parsedData).length > 0) {
        store.setContent(parsedData);
        console.log('Loaded data from localStorage');
        return;
      }
    }
  } catch (error) {
    console.log('No saved data found, loading initial data');
  }

  // Load initial data if no saved data
  loadInitialData();
  saveToLocalStorage();
  console.log('Database initialized with initial data');
};

// Save to localStorage
const saveToLocalStorage = () => {
  try {
    const content = store.getContent();
    localStorage.setItem('construction-site-db', JSON.stringify(content));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Load initial sample data
const loadInitialData = () => {
  // Initial equipment data
  const initialEquipment: Equipment[] = [
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
  ];

  // Initial safety checklist data
  const initialSafetyItems: SafetyItem[] = [
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
  ];

  // Populate the store with initial data
  initialEquipment.forEach(equipment => {
    store.setRow('equipment', equipment.id, equipment);
  });

  initialSafetyItems.forEach(item => {
    store.setRow('safetyItems', item.id, item);
  });
};

// Utility functions for database operations
export const getEquipment = (): Equipment[] => {
  const equipmentTable = store.getTable('equipment');
  return Object.keys(equipmentTable).map(id => {
    const row = (equipmentTable as any)[id];
    return {
      id: row.id,
      name: row.name,
      status: row.status,
      location: row.location,
      lastChecked: row.lastChecked,
      operator: row.operator || undefined
    };
  });
};

export const getSafetyItems = (): SafetyItem[] => {
  const safetyTable = store.getTable('safetyItems');
  return Object.keys(safetyTable).map(id => {
    const row = (safetyTable as any)[id];
    return {
      id: row.id,
      category: row.category,
      item: row.item,
      completed: row.completed,
      notes: row.notes || undefined,
      priority: row.priority
    };
  });
};

export const updateEquipment = (equipment: Equipment) => {
  store.setRow('equipment', equipment.id, equipment);
  saveToLocalStorage();
};

export const updateSafetyItem = (item: SafetyItem) => {
  store.setRow('safetyItems', item.id, item);
  saveToLocalStorage();
};

export const toggleSafetyItem = (id: string) => {
  const currentRow = store.getRow('safetyItems', id) as any;
  if (currentRow) {
    store.setCell('safetyItems', id, 'completed', !currentRow.completed);
    saveToLocalStorage();
  }
};