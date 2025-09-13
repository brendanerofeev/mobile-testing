import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Construction Site Manager App', () => {
  test('renders home page with construction site management interface', () => {
    render(<App />);
    
    expect(screen.getByText('Construction Site Manager')).toBeInTheDocument();
    expect(screen.getByText('Commercial Plumbing Site Management Tools')).toBeInTheDocument();
    expect(screen.getByText('Select a tool to get started with site management')).toBeInTheDocument();
    
    // Check that main tools are present
    expect(screen.getByText('Equipment Tracker')).toBeInTheDocument();
    expect(screen.getByText('Safety Checklist')).toBeInTheDocument();
  });

  test('displays all tool cards with proper icons and descriptions', () => {
    render(<App />);
    
    // Equipment Tracker
    expect(screen.getByText('Equipment Tracker')).toBeInTheDocument();
    expect(screen.getByText('Track and manage construction equipment')).toBeInTheDocument();
    
    // Safety Checklist
    expect(screen.getByText('Safety Checklist')).toBeInTheDocument();
    expect(screen.getByText('Daily safety inspections and compliance')).toBeInTheDocument();
    
    // Future tools
    expect(screen.getByText('Crew Management')).toBeInTheDocument();
    expect(screen.getByText('Material Inventory')).toBeInTheDocument();
    expect(screen.getByText('Progress Reports')).toBeInTheDocument();
    expect(screen.getByText('Quality Control')).toBeInTheDocument();
  });

  test('equipment tracker navigation works', () => {
    render(<App />);
    
    // Click on Equipment Tracker tool
    const equipmentCard = screen.getByText('Equipment Tracker').closest('.tool-card');
    expect(equipmentCard).toBeInTheDocument();
    fireEvent.click(equipmentCard!);
    
    // Should navigate to Equipment Tracker page
    expect(screen.getByText('🔧 Equipment Tracker')).toBeInTheDocument();
    expect(screen.getByText('Track and manage construction equipment')).toBeInTheDocument();
    expect(screen.getByText('Equipment Status')).toBeInTheDocument();
    
    // Should show equipment items
    expect(screen.getByText('Pipe Threading Machine')).toBeInTheDocument();
    expect(screen.getByText('Drain Snake - 50ft')).toBeInTheDocument();
    
    // Should have back button
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });

  test('safety checklist navigation works', () => {
    render(<App />);
    
    // Click on Safety Checklist tool
    const safetyCard = screen.getByText('Safety Checklist').closest('.tool-card');
    expect(safetyCard).toBeInTheDocument();
    fireEvent.click(safetyCard!);
    
    // Should navigate to Safety Checklist page
    expect(screen.getByText('⚠️ Safety Checklist')).toBeInTheDocument();
    expect(screen.getByText('Daily safety inspections and compliance')).toBeInTheDocument();
    expect(screen.getByText('Completion Status')).toBeInTheDocument();
    
    // Should show safety categories
    expect(screen.getByText('Personal Protective Equipment')).toBeInTheDocument();
    expect(screen.getByText('Work Area Safety')).toBeInTheDocument();
    
    // Should have back button
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });

  test('back button navigation works from equipment tracker', () => {
    render(<App />);
    
    // Navigate to Equipment Tracker
    const equipmentCard = screen.getByText('Equipment Tracker').closest('.tool-card');
    fireEvent.click(equipmentCard!);
    
    // Verify we're on Equipment Tracker page
    expect(screen.getByText('🔧 Equipment Tracker')).toBeInTheDocument();
    
    // Click back button
    const backButton = screen.getByText('← Back to Home');
    fireEvent.click(backButton);
    
    // Should be back on home page
    expect(screen.getByText('Construction Site Manager')).toBeInTheDocument();
    expect(screen.getByText('Commercial Plumbing Site Management Tools')).toBeInTheDocument();
  });

  test('back button navigation works from safety checklist', () => {
    render(<App />);
    
    // Navigate to Safety Checklist
    const safetyCard = screen.getByText('Safety Checklist').closest('.tool-card');
    fireEvent.click(safetyCard!);
    
    // Verify we're on Safety Checklist page
    expect(screen.getByText('⚠️ Safety Checklist')).toBeInTheDocument();
    
    // Click back button
    const backButton = screen.getByText('← Back to Home');
    fireEvent.click(backButton);
    
    // Should be back on home page
    expect(screen.getByText('Construction Site Manager')).toBeInTheDocument();
    expect(screen.getByText('Commercial Plumbing Site Management Tools')).toBeInTheDocument();
  });

  test('placeholder tools show coming soon message', () => {
    render(<App />);
    
    // Click on a placeholder tool (Crew Management)
    const crewCard = screen.getByText('Crew Management').closest('.tool-card');
    fireEvent.click(crewCard!);
    
    // Should show coming soon page
    expect(screen.getByText('🚧 Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('This tool is currently under development')).toBeInTheDocument();
    expect(screen.getByText('This tool will be available in a future update.')).toBeInTheDocument();
    
    // Should have back button
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });

  test('safety checklist items can be toggled', () => {
    render(<App />);
    
    // Navigate to Safety Checklist
    const safetyCard = screen.getByText('Safety Checklist').closest('.tool-card');
    fireEvent.click(safetyCard!);
    
    // Find a safety item that's not completed (Steel-toed boots)
    const steelBootsItem = screen.getByText('Steel-toed boots on all personnel').closest('.safety-item');
    expect(steelBootsItem).toBeInTheDocument();
    
    // The item should not be completed initially
    const checkbox = steelBootsItem!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    
    // Click to toggle
    fireEvent.click(steelBootsItem!);
    
    // Should now be checked
    expect(checkbox.checked).toBe(true);
  });
});
