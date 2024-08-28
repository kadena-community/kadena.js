import {
  validateChains,
  validateHeight,
  validateMinLesserThanMax,
} from '../validation';

describe('validation utils', () => {
  describe('validateMinLesserThanMax', () => {
    it('should validate that the Min <= Max', () => {
      const label = 'skeletor';
      const result = validateMinLesserThanMax(label, '1', '5', {});
      expect(result[label]).toBe(undefined);

      const result2 = validateMinLesserThanMax(label, '5', '5', {});
      expect(result2[label]).toBe(undefined);
    });

    it('should NOT validate that the Min > Max', () => {
      const label = 'skeletor';
      const result = validateMinLesserThanMax(label, '19', '5', {});
      expect(result[label].length > 0).toBe(true);
    });
  });
  describe('validateHeight', () => {
    it('should validate if the string is a digit', () => {
      const label = 'minHeight';
      const result = validateHeight(label, '1', {});
      expect(result[label]).toBe(undefined);
      expect(result[label]?.length > 0).toBe(false);

      const result2 = validateHeight(label, '123234', { [label]: 'he-man' });
      expect(result2[label]).toBe(undefined);
    });

    it('should NOT validate if the string has non digit characters', () => {
      const label = 'minHeight';
      const result = validateHeight(label, 'skeletor', {});
      expect(result[label].length > 0).toBe(true);

      const result2 = validateHeight(label, '11he-man', {});
      expect(result2[label].length > 0).toBe(true);
    });
  });
  describe('validateChains', () => {
    it('should validate strings that are just 1 number', () => {
      const result = validateChains('1', {});
      expect(result.chains).toBe(undefined);

      const result2 = validateChains('1', { chains: 'error' });
      expect(result2.chains).toBe(undefined);
    });

    it('should validate strings that empty', () => {
      const result = validateChains('', {});
      expect(result.chains).toBe(undefined);

      const result2 = validateChains(undefined, { chains: 'error' });
      expect(result2.chains).toBe(undefined);
    });

    it('should validate strings that comma seperated', () => {
      const result = validateChains('1, 2, 4, 8', {});
      expect(result.chains).toBe(undefined);
      expect(result.chains?.length > 0).toBe(false);
    });

    it('should validate strings that show a range', () => {
      const result = validateChains('1, 2-8, 4, 8', {});
      expect(result.chains).toBe(undefined);
      expect(result.chains?.length > 0).toBe(false);

      const result2 = validateChains('2-8', {});
      expect(result2.chains).toBe(undefined);
    });

    it('should NOT validate strings that contain other characters than digits or commas', () => {
      const result = validateChains('1,2, 4, 8, sdfs', {});
      expect(result.chains.length > 0).toBe(true);
    });
  });
});
