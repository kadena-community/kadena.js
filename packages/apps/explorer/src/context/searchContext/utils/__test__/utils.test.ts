import {
  getSearchOptionByIndex,
  getSearchOptions,
  getSearchOptionTitle,
  SEARCHOPTIONS,
} from '../utils';

describe('search utils', () => {
  describe('getSearchOptionTitle', () => {
    it('should return the correct title for searchOption', () => {
      const result = getSearchOptionTitle(SEARCHOPTIONS.ACCOUNT);
      expect(result).toBe('Account');
    });
  });

  describe('getSearchOptionByIndex', () => {
    it('should return the correct value of SEARCHOPTION by given index', () => {
      const result = getSearchOptionByIndex(1);
      expect(result).toEqual('REQUESTKEY');
    });
    it('should return null if index does not exist', () => {
      const result = getSearchOptionByIndex(15);
      expect(result).toEqual(null);
    });
    it('should return null if index is null', () => {
      const result = getSearchOptionByIndex(null);
      expect(result).toEqual(null);
    });
  });

  describe('getSearchOptions', () => {
    it('should return an array of the enum SearchOptionEnum', () => {
      const result = getSearchOptions();
      expect(result).toEqual([
        'ACCOUNT',
        'REQUESTKEY',
        'BLOCKHASH',
        'BLOCKHEIGHT',
        'EVENT',
      ]);
    });
  });
});
