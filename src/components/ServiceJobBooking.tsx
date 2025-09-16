import React, { useState } from 'react';
import { mockClients, ServiceJob, EquipmentLineItem, saveServiceJob, generateServiceJobId } from '../database/store';
import { mockExtractFieldsFromText, LLMFieldExtraction } from '../utils/llmService';
import './ServiceJobBooking.css';

interface ServiceJobBookingProps {
  onBack: () => void;
}

const ServiceJobBooking: React.FC<ServiceJobBookingProps> = ({ onBack }) => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [m2, setM2] = useState<string>('');
  const [chemicals, setChemicals] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [access, setAccess] = useState<string>('');
  const [lighting, setLighting] = useState<string>('');
  const [equipment, setEquipment] = useState<EquipmentLineItem[]>([]);
  const [labour, setLabour] = useState<string>('');
  const [voiceInput, setVoiceInput] = useState<string>('');
  const [isProcessingLLM, setIsProcessingLLM] = useState<boolean>(false);
  const [llmError, setLlmError] = useState<string>('');

  const addEquipmentItem = () => {
    const newItem: EquipmentLineItem = {
      id: 'eq_' + Date.now(),
      description: '',
      units: 0,
      hours: 0
    };
    setEquipment([...equipment, newItem]);
  };

  const updateEquipmentItem = (id: string, field: keyof EquipmentLineItem, value: string | number) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeEquipmentItem = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !m2) {
      alert('Please select a client and enter M2 value');
      return;
    }

    const client = mockClients.find(c => c.id === selectedClient);
    if (!client) {
      alert('Invalid client selected');
      return;
    }

    const serviceJob: ServiceJob = {
      id: generateServiceJobId(),
      clientId: selectedClient,
      clientName: client.name,
      m2: parseFloat(m2) || 0,
      chemicals,
      summary,
      access,
      lighting,
      equipment: equipment.filter(item => item.description.trim() !== ''),
      labour: parseFloat(labour) || 0,
      voiceInput: voiceInput.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveServiceJob(serviceJob);
    alert('Service job booked successfully!');
    
    // Reset form
    setSelectedClient('');
    setM2('');
    setChemicals('');
    setSummary('');
    setAccess('');
    setLighting('');
    setEquipment([]);
    setLabour('');
    setVoiceInput('');
    setLlmError('');
  };

  const handleLLMFillFields = async () => {
    if (!voiceInput.trim()) {
      setLlmError('Please enter some text to process');
      return;
    }

    setIsProcessingLLM(true);
    setLlmError('');

    try {
      // Use mock function for now since API key is not configured
      const result = await mockExtractFieldsFromText(voiceInput);

      if (result.success && result.data) {
        populateFieldsFromLLM(result.data);
      } else {
        setLlmError(result.error || 'Failed to extract fields from text');
      }
    } catch (error) {
      console.error('LLM processing error:', error);
      setLlmError('An error occurred while processing the text');
    } finally {
      setIsProcessingLLM(false);
    }
  };

  const populateFieldsFromLLM = (data: LLMFieldExtraction) => {
    // Populate form fields with extracted data
    if (data.m2 !== undefined) {
      setM2(data.m2.toString());
    }
    if (data.chemicals) {
      setChemicals(data.chemicals);
    }
    if (data.summary) {
      setSummary(data.summary);
    }
    if (data.access) {
      setAccess(data.access);
    }
    if (data.lighting) {
      setLighting(data.lighting);
    }
    if (data.labour !== undefined) {
      setLabour(data.labour.toString());
    }
    if (data.equipment && data.equipment.length > 0) {
      // Add extracted equipment to existing equipment
      setEquipment(prevEquipment => [...prevEquipment, ...data.equipment!]);
    }

    // Show success feedback
    alert('Fields have been auto-populated from your text input!');
  };

  return (
    <div className="service-job-booking">
      <header className="tool-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <div className="header-content">
          <h1>📋 Service Job Booking</h1>
          <p>Book a new service job with comprehensive details</p>
        </div>
      </header>

      <div className="booking-content">
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Client Selection */}
          <div className="form-group">
            <label htmlFor="client">Client *</label>
            <select 
              id="client"
              value={selectedClient} 
              onChange={(e) => setSelectedClient(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a client...</option>
              {mockClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.contact}
                </option>
              ))}
            </select>
          </div>

          {/* M2 Field */}
          <div className="form-group">
            <label htmlFor="m2">M2 (Area) *</label>
            <input
              type="number"
              id="m2"
              value={m2}
              onChange={(e) => setM2(e.target.value)}
              step="0.01"
              min="0"
              placeholder="Enter area in square meters"
              required
              className="form-input"
            />
          </div>

          {/* Chemicals */}
          <div className="form-group">
            <label htmlFor="chemicals">Chemicals</label>
            <input
              type="text"
              id="chemicals"
              value={chemicals}
              onChange={(e) => setChemicals(e.target.value)}
              placeholder="List chemicals to be used"
              className="form-input"
            />
          </div>

          {/* Summary */}
          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the work to be performed..."
              rows={4}
              className="form-textarea"
            />
          </div>

          {/* Access */}
          <div className="form-group">
            <label htmlFor="access">Access</label>
            <input
              type="text"
              id="access"
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              placeholder="Access requirements and restrictions"
              className="form-input"
            />
          </div>

          {/* Lighting */}
          <div className="form-group">
            <label htmlFor="lighting">Lighting</label>
            <input
              type="text"
              id="lighting"
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              placeholder="Lighting conditions and requirements"
              className="form-input"
            />
          </div>

          {/* Equipment Line Items */}
          <div className="form-group">
            <label>Equipment</label>
            <div className="equipment-section">
              {equipment.map((item) => (
                <div key={item.id} className="equipment-item">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateEquipmentItem(item.id, 'description', e.target.value)}
                    placeholder="Equipment description"
                    className="equipment-description"
                  />
                  <input
                    type="number"
                    value={item.units}
                    onChange={(e) => updateEquipmentItem(item.id, 'units', parseInt(e.target.value) || 0)}
                    placeholder="Units"
                    min="0"
                    className="equipment-units"
                  />
                  <span className="equipment-multiply">×</span>
                  <input
                    type="number"
                    value={item.hours}
                    onChange={(e) => updateEquipmentItem(item.id, 'hours', parseFloat(e.target.value) || 0)}
                    placeholder="Hours"
                    min="0"
                    step="0.25"
                    className="equipment-hours"
                  />
                  <button
                    type="button"
                    onClick={() => removeEquipmentItem(item.id)}
                    className="remove-equipment-btn"
                    aria-label="Remove equipment item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEquipmentItem}
                className="add-equipment-btn"
              >
                + Add Equipment
              </button>
            </div>
          </div>

          {/* Labour */}
          <div className="form-group">
            <label htmlFor="labour">Labour (Total Hours)</label>
            <input
              type="number"
              id="labour"
              value={labour}
              onChange={(e) => setLabour(e.target.value)}
              step="0.25"
              min="0"
              placeholder="Total labour hours"
              className="form-input"
            />
          </div>

          {/* Voice Input */}
          <div className="form-group">
            <label htmlFor="voiceInput">Voice Input (for AI processing)</label>
            <textarea
              id="voiceInput"
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
              placeholder="Enter text here (voice-to-text input on mobile) that will be processed by AI to auto-fill fields..."
              rows={3}
              className="form-textarea voice-input"
            />
            {llmError && (
              <div className="llm-error" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                {llmError}
              </div>
            )}
            <button
              type="button"
              onClick={handleLLMFillFields}
              className="llm-button"
              disabled={!voiceInput.trim() || isProcessingLLM}
            >
              {isProcessingLLM ? '🔄 Processing...' : '🤖 Fill Fields with AI'}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              📋 Book Service Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceJobBooking;