import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Mock the LLM service
jest.mock('../utils/llmService', () => ({
  mockExtractFieldsFromText: jest.fn()
}));

describe('ServiceJobBooking', () => {
  const mockOnBack = jest.fn();
  const mockExtractFieldsFromText = require('../utils/llmService').mockExtractFieldsFromText;

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

  test('LLM button processes voice input and populates fields', async () => {
    // Mock successful LLM response
    mockExtractFieldsFromText.mockResolvedValue({
      success: true,
      data: {
        m2: 150,
        chemicals: 'bleach, detergent',
        summary: 'Test cleaning job',
        access: 'ladder access required',
        lighting: 'poor lighting',
        labour: 8,
        equipment: [
          {
            id: 'eq_test_1',
            description: 'pressure washer',
            units: 2,
            hours: 4
          }
        ]
      }
    });

    // Mock window.alert
    window.alert = jest.fn();
    
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    // Add voice input
    const voiceInput = screen.getByRole('textbox', { name: 'Voice Input (for AI processing)' });
    fireEvent.change(voiceInput, { target: { value: 'Clean 150 m2 with bleach and detergent using pressure washer, 8 hours labour' } });
    
    // Click LLM button
    const llmButton = screen.getByRole('button', { name: /Fill Fields with AI/ });
    fireEvent.click(llmButton);
    
    // Wait for processing
    await waitFor(() => {
      expect(mockExtractFieldsFromText).toHaveBeenCalledWith('Clean 150 m2 with bleach and detergent using pressure washer, 8 hours labour');
    });

    // Wait for fields to be populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('150')).toBeInTheDocument(); // M2 field
      expect(screen.getByDisplayValue('bleach, detergent')).toBeInTheDocument(); // Chemicals
      expect(screen.getByDisplayValue('Test cleaning job')).toBeInTheDocument(); // Summary
      expect(screen.getByDisplayValue('ladder access required')).toBeInTheDocument(); // Access
      expect(screen.getByDisplayValue('poor lighting')).toBeInTheDocument(); // Lighting
      expect(screen.getByDisplayValue('8')).toBeInTheDocument(); // Labour
    });

    // Check that alert was called
    expect(window.alert).toHaveBeenCalledWith('Fields have been auto-populated from your text input!');
  });

  test('LLM button shows error when processing fails', async () => {
    // Mock failed LLM response
    mockExtractFieldsFromText.mockResolvedValue({
      success: false,
      error: 'Failed to process text'
    });
    
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    // Add voice input
    const voiceInput = screen.getByRole('textbox', { name: 'Voice Input (for AI processing)' });
    fireEvent.change(voiceInput, { target: { value: 'Invalid input' } });
    
    // Click LLM button
    const llmButton = screen.getByRole('button', { name: /Fill Fields with AI/ });
    fireEvent.click(llmButton);
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to process text')).toBeInTheDocument();
    });
  });

  test('LLM button is disabled for empty input and validates properly', async () => {
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    const voiceInput = screen.getByRole('textbox', { name: 'Voice Input (for AI processing)' });
    const llmButton = screen.getByRole('button', { name: /Fill Fields with AI/ });
    
    // Button should be disabled initially
    expect(llmButton).toBeDisabled();
    
    // Add some text - button should become enabled
    fireEvent.change(voiceInput, { target: { value: 'test input' } });
    expect(llmButton).not.toBeDisabled();
    
    // Clear text - button should become disabled again
    fireEvent.change(voiceInput, { target: { value: '' } });
    expect(llmButton).toBeDisabled();
    
    // Test with whitespace only - button should remain disabled
    fireEvent.change(voiceInput, { target: { value: '   ' } });
    expect(llmButton).toBeDisabled();
  });

  test('LLM button is disabled during processing', async () => {
    // Mock LLM response with delay
    mockExtractFieldsFromText.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} }), 100))
    );
    
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    // Add voice input
    const voiceInput = screen.getByRole('textbox', { name: 'Voice Input (for AI processing)' });
    fireEvent.change(voiceInput, { target: { value: 'Test input' } });
    
    // Click LLM button
    const llmButton = screen.getByRole('button', { name: /Fill Fields with AI/ });
    fireEvent.click(llmButton);
    
    // Check that button shows processing state
    await waitFor(() => {
      expect(screen.getByText('🔄 Processing...')).toBeInTheDocument();
    });
  });

  test('LLM button shows placeholder message', () => {
    render(<ServiceJobBooking onBack={mockOnBack} />);
    
    const llmButton = screen.getByRole('button', { name: /Fill Fields with AI/ });
    expect(llmButton).toBeInTheDocument();
    expect(llmButton).toBeDisabled(); // Should be disabled when no voice input
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