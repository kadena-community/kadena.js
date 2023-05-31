import { formatISODate, getOneMonthAgo } from '../dates';

describe('utils dates', () => {
  describe('getOneMonthAgo', () => {
    test('returns the date 1 month ago', () => {
      const currentDate = new Date();
      const expectedDate = new Date();
      expectedDate.setMonth(expectedDate.getMonth() - 1);
      if (expectedDate.getMonth() === currentDate.getMonth())
        expectedDate.setDate(0);

      const result = getOneMonthAgo(currentDate);

      expect(result).toEqual(expectedDate);
    });
  });
  describe('formatISODate', () => {
    test('return an ISO Date string', () => {
      const currentDate = new Date(1977, 9, 13);
      const expectedResult = '1977-10-13';

      const result = formatISODate(currentDate);
      expect(result).toEqual(expectedResult);
    });
  });
});
