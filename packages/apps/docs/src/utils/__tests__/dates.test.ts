import { formatDateDistance, formatISODate, getOneMonthAgo } from '../dates';

describe('utils dates', () => {
  describe('formatDateDistance', () => {
    beforeEach(() => {
      // tell vitest we use mocked time
      vi.useFakeTimers();
    });

    afterEach(() => {
      // restoring date after each test run
      vi.useRealTimers();
    });

    it('should throw when date is not valid', () => {
      expect(() => formatDateDistance(new Date('2342r'))).toThrowError(
        'Invalid Date',
      );
    });

    it('should return today when the date is the same as today', () => {
      vi.setSystemTime(new Date(1977, 9, 13));

      expect(formatDateDistance(new Date(1977, 9, 13))).toEqual('today');
    });

    it('should return yesterday when the date is the same as yesterday', () => {
      vi.setSystemTime(new Date(1977, 9, 13));

      expect(formatDateDistance(new Date(1977, 9, 12))).toEqual('yesterday');
    });

    it('should return dates x days ago when the date is the earlier as yesterday', () => {
      vi.setSystemTime(new Date(1977, 9, 13));

      expect(formatDateDistance(new Date(1977, 9, 11))).toEqual('2 days ago');
      expect(formatDateDistance(new Date(1977, 8, 11))).toEqual(
        'about 1 month ago',
      );
      expect(formatDateDistance(new Date(1975, 9, 11))).toEqual(
        'about 2 years ago',
      );
    });
  });
  describe('getOneMonthAgo', () => {
    it('should return the date 1 month ago', () => {
      const currentDate = new Date();
      const expectedDate = new Date();
      expectedDate.setMonth(expectedDate.getMonth() - 1);
      if (expectedDate.getMonth() === currentDate.getMonth()) {
        expectedDate.setDate(0);
      }

      const result = getOneMonthAgo(currentDate);

      expect(result).toEqual(expectedDate);
    });
  });
  describe('formatISODate', () => {
    it('should return an ISO Date string', () => {
      const currentDate = new Date(1977, 9, 13);
      const expectedResult = '1977-10-13';

      const result = formatISODate(currentDate);
      expect(result).toEqual(expectedResult);
    });
  });
});
