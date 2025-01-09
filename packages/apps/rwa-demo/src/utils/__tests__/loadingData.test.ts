import { loadingData } from '../loadingData';

describe('loadingData utils', () => {
  describe('loadingData', () => {
    it('should return an empty array of 5', () => {
      expect(loadingData.length).toBe(5);
    });
  });
});
