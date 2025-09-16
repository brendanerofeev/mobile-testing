import { mockExtractFieldsFromText, LLMResponse } from './llmService';

describe('LLM Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mockExtractFieldsFromText', () => {
    test('returns error for empty input', async () => {
      const result = await mockExtractFieldsFromText('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Input text is empty');
    });

    test('returns error for whitespace-only input', async () => {
      const result = await mockExtractFieldsFromText('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Input text is empty');
    });

    test('extracts area from text with square meters', async () => {
      const result = await mockExtractFieldsFromText('Need to clean 150 square meters');
      expect(result.success).toBe(true);
      expect(result.data?.m2).toBe(150);
    });

    test('extracts area from text with m2', async () => {
      const result = await mockExtractFieldsFromText('Area is 75.5 m2');
      expect(result.success).toBe(true);
      expect(result.data?.m2).toBe(75.5);
    });

    test('extracts chemicals from text', async () => {
      const result = await mockExtractFieldsFromText('Use bleach and detergent for cleaning');
      expect(result.success).toBe(true);
      expect(result.data?.chemicals).toBe('bleach, detergent');
    });

    test('extracts labour hours from text', async () => {
      const result = await mockExtractFieldsFromText('Estimate 8 hours of labour');
      expect(result.success).toBe(true);
      expect(result.data?.labour).toBe(8);
    });

    test('extracts multiple labour hour formats', async () => {
      const result1 = await mockExtractFieldsFromText('Need 6.5 labour hours');
      expect(result1.data?.labour).toBe(6.5);

      const result2 = await mockExtractFieldsFromText('Total of 12 hours labour');
      expect(result2.data?.labour).toBe(12);

      const result3 = await mockExtractFieldsFromText('estimate 8 hours total labour');
      expect(result3.data?.labour).toBe(8);

      const result4 = await mockExtractFieldsFromText('requires 4.5 hours of labour');
      expect(result4.data?.labour).toBe(4.5);
    });

    test('extracts access requirements', async () => {
      const result = await mockExtractFieldsFromText('Requires ladder access for high areas');
      expect(result.success).toBe(true);
      expect(result.data?.access).toBe('Special access requirements mentioned');
    });

    test('extracts lighting information', async () => {
      const result = await mockExtractFieldsFromText('Poor lighting conditions in the area');
      expect(result.success).toBe(true);
      expect(result.data?.lighting).toBe('Lighting considerations mentioned');
    });

    test('extracts equipment from text', async () => {
      const result = await mockExtractFieldsFromText('Need pressure washer and vacuum for the job');
      expect(result.success).toBe(true);
      expect(result.data?.equipment).toBeDefined();
      expect(result.data?.equipment?.length).toBeGreaterThan(0);
      
      const descriptions = result.data?.equipment?.map(eq => eq.description) || [];
      expect(descriptions).toContain('pressure washer');
      expect(descriptions).toContain('vacuum');
    });

    test('sets default values for equipment', async () => {
      const result = await mockExtractFieldsFromText('Need a mop for cleaning');
      expect(result.success).toBe(true);
      
      const equipment = result.data?.equipment?.[0];
      expect(equipment).toBeDefined();
      expect(equipment?.description).toBe('mop');
      expect(equipment?.units).toBe(1);
      expect(equipment?.hours).toBe(2);
      expect(equipment?.id).toMatch(/^eq_\d+_[a-z0-9]+$/);
    });

    test('generates summary when data is extracted', async () => {
      const result = await mockExtractFieldsFromText('Clean 100 m2 with bleach');
      expect(result.success).toBe(true);
      expect(result.data?.summary).toBe('Service job extracted from voice input');
    });

    test('handles complex input with multiple fields', async () => {
      const complexInput = 'Need to clean 200 square meters with bleach and detergent. ' +
                          'Requires ladder access for high areas. Poor lighting conditions. ' +
                          'Will need pressure washer and vacuum. Estimate 10 hours of labour.';
      
      const result = await mockExtractFieldsFromText(complexInput);
      expect(result.success).toBe(true);
      
      const data = result.data!;
      expect(data.m2).toBe(200);
      expect(data.chemicals).toBe('bleach, detergent');
      expect(data.access).toBe('Special access requirements mentioned');
      expect(data.lighting).toBe('Lighting considerations mentioned');
      expect(data.labour).toBe(10);
      expect(data.equipment?.length).toBeGreaterThan(0);
      expect(data.summary).toBe('Service job extracted from voice input');
    });

    test('returns empty data object when no keywords found', async () => {
      const result = await mockExtractFieldsFromText('This is just random text with no relevant information');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    test('handles case insensitive matching', async () => {
      const result = await mockExtractFieldsFromText('CLEAN 50 M2 WITH BLEACH AND LADDER ACCESS');
      expect(result.success).toBe(true);
      expect(result.data?.m2).toBe(50);
      expect(result.data?.chemicals).toBe('bleach');
      expect(result.data?.access).toBe('Special access requirements mentioned');
    });
  });
});