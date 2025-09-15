import { store, initializeDatabase, getEquipment, getSafetyItems, toggleSafetyItem } from '../database/store';

describe('Database Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear the store
    store.setContent([{}, {}]);
  });

  test('initializes database with sample data', () => {
    initializeDatabase();
    
    const equipment = getEquipment();
    const safetyItems = getSafetyItems();
    
    expect(equipment).toHaveLength(5);
    expect(safetyItems).toHaveLength(9);
    
    // Check some sample data
    expect(equipment[0].name).toBe('Pipe Threading Machine');
    expect(safetyItems[0].item).toBe('All workers wearing hard hats');
  });

  test('toggles safety item completion status', () => {
    initializeDatabase();
    
    const initialItems = getSafetyItems();
    const testItem = initialItems.find(item => item.id === 'safety003');
    const initialStatus = testItem?.completed;
    
    toggleSafetyItem('safety003');
    
    const updatedItems = getSafetyItems();
    const updatedItem = updatedItems.find(item => item.id === 'safety003');
    
    expect(updatedItem?.completed).toBe(!initialStatus);
  });

  test('persists data to localStorage', () => {
    initializeDatabase();
    
    // Toggle an item
    toggleSafetyItem('safety003');
    
    // Check that data was saved to localStorage
    const savedData = localStorage.getItem('construction-site-db');
    expect(savedData).toBeTruthy();
    
    // Parse and verify the data
    const parsedData = JSON.parse(savedData!);
    expect(parsedData).toBeInstanceOf(Array);
    expect(parsedData[0]).toHaveProperty('safetyItems');
    expect(parsedData[0].safetyItems['safety003'].completed).toBe(true);
  });

  test('loads data from localStorage on initialization', () => {
    // Set up initial data
    initializeDatabase();
    toggleSafetyItem('safety003');
    
    // Clear store but keep localStorage
    store.setContent([{}, {}]);
    
    // Initialize again (should load from localStorage)
    initializeDatabase();
    
    const items = getSafetyItems();
    const testItem = items.find(item => item.id === 'safety003');
    
    expect(testItem?.completed).toBe(true);
  });
});