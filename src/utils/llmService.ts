import { EquipmentLineItem } from '../database/store';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Note: API key is hardcoded for POC as mentioned in issue requirements
const OPENAI_API_KEY = 'your-openai-api-key-here'; // Will be replaced with actual key

export interface LLMFieldExtraction {
  m2?: number;
  chemicals?: string;
  summary?: string;
  access?: string;
  lighting?: string;
  equipment?: EquipmentLineItem[];
  labour?: number;
}

export interface LLMResponse {
  success: boolean;
  data?: LLMFieldExtraction;
  error?: string;
}

const createSystemPrompt = (): string => {
  return `You are an AI assistant that extracts construction/plumbing service job information from natural language input and converts it to structured JSON.

Given text input about a service job, extract the following fields if mentioned:
- m2: Area in square meters (number)
- chemicals: Any chemicals or cleaning products mentioned (string)
- summary: Brief description of the work (string) 
- access: Access requirements or restrictions (string)
- lighting: Lighting conditions or requirements (string)
- equipment: Array of equipment with description, units, and hours (array of objects)
- labour: Total labour hours (number)

Equipment items should have this structure:
{
  "id": "eq_[timestamp]",
  "description": "Equipment name/description",
  "units": number_of_units,
  "hours": estimated_hours
}

Only include fields that can be reasonably inferred from the input text. Return a valid JSON object with only the fields you can extract. If no information can be extracted, return an empty object {}.

Example input: "Need to clean 150 square meters with bleach and detergent. Requires ladder access for high areas. Poor lighting conditions. Will need 2 pressure washers for 4 hours each and estimate 8 hours total labour."

Example output:
{
  "m2": 150,
  "chemicals": "bleach and detergent",
  "summary": "Cleaning service with pressure washing",
  "access": "ladder access for high areas",
  "lighting": "poor lighting conditions",
  "equipment": [
    {
      "id": "eq_1732012345678",
      "description": "pressure washer",
      "units": 2,
      "hours": 4
    }
  ],
  "labour": 8
}`;
};

export const extractFieldsFromText = async (inputText: string): Promise<LLMResponse> => {
  if (!inputText.trim()) {
    return {
      success: false,
      error: 'Input text is empty'
    };
  }

  // Check if API key is configured
  if (OPENAI_API_KEY === 'your-openai-api-key-here') {
    return {
      success: false,
      error: 'OpenAI API key not configured. Please set the API key in the llmService.ts file.'
    };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: createSystemPrompt()
          },
          {
            role: 'user',
            content: inputText
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    if (!responseData.choices || responseData.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    const content = responseData.choices[0].message.content;
    
    // Parse the JSON response
    let extractedData: LLMFieldExtraction;
    try {
      extractedData = JSON.parse(content);
    } catch (parseError) {
      throw new Error('Failed to parse LLM response as JSON');
    }

    // Validate and clean the extracted data
    const validatedData = validateExtractedData(extractedData);

    return {
      success: true,
      data: validatedData
    };

  } catch (error) {
    console.error('LLM extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const validateExtractedData = (data: any): LLMFieldExtraction => {
  const validated: LLMFieldExtraction = {};

  // Validate m2 (number)
  if (typeof data.m2 === 'number' && data.m2 > 0) {
    validated.m2 = Number(data.m2.toFixed(2));
  }

  // Validate strings
  if (typeof data.chemicals === 'string' && data.chemicals.trim()) {
    validated.chemicals = data.chemicals.trim();
  }
  if (typeof data.summary === 'string' && data.summary.trim()) {
    validated.summary = data.summary.trim();
  }
  if (typeof data.access === 'string' && data.access.trim()) {
    validated.access = data.access.trim();
  }
  if (typeof data.lighting === 'string' && data.lighting.trim()) {
    validated.lighting = data.lighting.trim();
  }

  // Validate labour (number)
  if (typeof data.labour === 'number' && data.labour > 0) {
    validated.labour = Number(data.labour.toFixed(2));
  }

  // Validate equipment array
  if (Array.isArray(data.equipment)) {
    const validEquipment: EquipmentLineItem[] = [];
    
    data.equipment.forEach((item: any) => {
      if (item && typeof item === 'object') {
        const equipmentItem: EquipmentLineItem = {
          id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          description: typeof item.description === 'string' ? item.description.trim() : '',
          units: typeof item.units === 'number' && item.units > 0 ? Math.floor(item.units) : 1,
          hours: typeof item.hours === 'number' && item.hours > 0 ? Number(item.hours.toFixed(2)) : 0
        };

        if (equipmentItem.description) {
          validEquipment.push(equipmentItem);
        }
      }
    });

    if (validEquipment.length > 0) {
      validated.equipment = validEquipment;
    }
  }

  return validated;
};

// Mock function for testing when API key is not available
export const mockExtractFieldsFromText = async (inputText: string): Promise<LLMResponse> => {
  if (!inputText.trim()) {
    return {
      success: false,
      error: 'Input text is empty'
    };
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock extraction based on common keywords
  const mockData: LLMFieldExtraction = {};

  const lowerText = inputText.toLowerCase();

  // Extract area if mentioned
  const areaMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:square\s*meters?|m2|sqm)/);
  if (areaMatch) {
    mockData.m2 = parseFloat(areaMatch[1]);
  }

  // Extract chemicals
  const chemicalKeywords = ['bleach', 'detergent', 'cleaner', 'chemical', 'disinfectant', 'acid', 'solvent'];
  const mentionedChemicals = chemicalKeywords.filter(chemical => lowerText.includes(chemical));
  if (mentionedChemicals.length > 0) {
    mockData.chemicals = mentionedChemicals.join(', ');
  }

  // Extract access information
  if (lowerText.includes('ladder') || lowerText.includes('access') || lowerText.includes('restricted')) {
    mockData.access = 'Special access requirements mentioned';
  }

  // Extract lighting information
  if (lowerText.includes('lighting') || lowerText.includes('dark') || lowerText.includes('light')) {
    mockData.lighting = 'Lighting considerations mentioned';
  }

  // Extract labour hours
  const labourMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:hours?\s*(?:of\s*|total\s*)?labour|labour\s*hours?|hours?\s*total\s*labour)/);
  if (labourMatch) {
    mockData.labour = parseFloat(labourMatch[1]);
  }

  // Extract equipment
  const equipmentKeywords = ['pressure washer', 'vacuum', 'mop', 'bucket', 'hose', 'ladder', 'scrubber'];
  const equipment: EquipmentLineItem[] = [];
  
  equipmentKeywords.forEach(item => {
    if (lowerText.includes(item)) {
      equipment.push({
        id: `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: item,
        units: 1,
        hours: 2
      });
    }
  });

  if (equipment.length > 0) {
    mockData.equipment = equipment;
  }

  // Generate a summary if we have extracted data
  if (Object.keys(mockData).length > 0) {
    mockData.summary = 'Service job extracted from voice input';
  }

  return {
    success: true,
    data: mockData
  };
};