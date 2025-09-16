import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceJobBooking from './ServiceJobBooking';

// Mock the database store
jest.mock('../database/store', () => ({
  mockClients: [
    {
      id: 'client001',
      name: 'Test Client',
      address: '123 Test St',
      contact: 'John Doe - (555) 123-4567'
    }
  ],
  saveServiceJob: jest.fn(),
  generateServiceJobId: jest.fn(() => 'test_job_id')
}));

describe('ServiceJobBooking', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders service job booking form', () => {
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    expect(screen.getByText('📋 Service Job Booking')).toBeInTheDocument();
    expect(screen.getByText('Book a new service job with comprehensive details')).toBeInTheDocument();
    expect(screen.getByLabelText('Client *')).toBeInTheDocument();
    expect(screen.getByLabelText('M2 (Area) *')).toBeInTheDocument();
    expect(screen.getByLabelText('Chemicals')).toBeInTheDocument();
    expect(screen.getByLabelText('Summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Access')).toBeInTheDocument();
    expect(screen.getByLabelText('Lighting')).toBeInTheDocument();
    expect(screen.getByLabelText('Labour (Total Hours)')).toBeInTheDocument();
    expect(screen.getByLabelText('Voice Input (for AI processing)')).toBeInTheDocument();
  });

  test('renders all required form fields', () => {
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    expect(screen.getByRole('combobox', { name: 'Client *' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'M2 (Area) *' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Chemicals' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Summary' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Access' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Lighting' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Labour (Total Hours)' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Voice Input (for AI processing)' })).toBeInTheDocument();
  });

  test('can add equipment items', () => {
    const { container } = render(<ServiceJobBooking onBack={mockOnBack} />);
    
    const addButton = screen.getByRole('button', { name: '+ Add Equipment' });
    fireEvent.click(addButton);
    
    expect(container.querySelector('input[placeholder="Equipment description"]')).toBeInTheDocument();
    expect(container.querySelector('input[placeholder="Units"]')).toBeInTheDocument();
    expect(container.querySelector('input[placeholder="Hours"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove equipment item' })).toBeInTheDocument();
  });

  test('back button calls onBack function', () => {
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    const backButton = screen.getByRole('button', { name: '← Back to Home' });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('LLM button shows placeholder message', () => {
    // Mock window.alert
    window.alert = jest.fn();
    
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    // Add some voice input to enable the button
    const voiceInput = screen.getByRole('textbox', { name: 'Voice Input (for AI processing)' });
    fireEvent.change(voiceInput, { target: { value: 'Test voice input' } });
    
    const llmButton = screen.getByRole('button', { name: /Fill Fields with AI/ });
    fireEvent.click(llmButton);
    
    expect(window.alert).toHaveBeenCalledWith('LLM field population feature coming soon! This will analyze your voice input and auto-fill relevant fields.');
  });

  test('renders with all mock clients in dropdown', () => {
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    const clientSelect = screen.getByRole('combobox', { name: 'Client *' });
    expect(clientSelect).toBeInTheDocument();
    
    // Check that the select has options (including the default "Select a client..." option)
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(1); // At least the default + mock clients
  });
});