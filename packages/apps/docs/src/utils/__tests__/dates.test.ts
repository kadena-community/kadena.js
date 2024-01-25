import {
  compareDesc,
  formatDateDistance,
  formatISODate,
  getOneMonthAgo,
} from '../dates';

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
  describe('compareDesc', () => {
    it('should throw when either left or right date is missing', () => {
      expect(() => compareDesc()).toThrowError(
        'invalid date compare with undefined dates',
      );
      expect(() => compareDesc('1977-10-13')).toThrowError(
        'invalid date compare with undefined dates',
      );
      expect(() => compareDesc(undefined, '1977-10-13')).toThrowError(
        'invalid date compare with undefined dates',
      );
    });

    it('should throw when either left or right date are invalid', () => {
      expect(() => compareDesc('no date', '1977-10-13')).toThrowError(
        'invalid date compare: no date : 1977-10-13 ',
      );
      expect(() => compareDesc('1977-10-13', 'no date')).toThrowError(
        'invalid date compare: 1977-10-13 : no date',
      );
    });

    it('should return -1 when left is later than right', () => {
      expect(compareDesc('2013-06-04', '1977-10-13')).toEqual(-1);
    });

    it('should return 1 when left is earlier than right', () => {
      expect(compareDesc('1977-10-13', '2013-06-04')).toEqual(1);
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
