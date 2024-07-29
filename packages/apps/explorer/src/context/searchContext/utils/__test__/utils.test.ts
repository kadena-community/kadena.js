import {
  getSearchOptions,
  getSearchOptionTitle,
  SearchOptionEnum,
} from '../utils';

describe('search utils', () => {
  describe('getSearchOptionTitle', () => {
    it('should return the correct title for searchOption', () => {
      const result = getSearchOptionTitle(SearchOptionEnum.ACCOUNT);
      expect(result).toBe('Account');
    });
  });

  describe('getSearchOptions', () => {
    it('should return an array of the enum SearchOptionEnum', () => {
      const result = getSearchOptions();
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });
  });
});
