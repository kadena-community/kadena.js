import { formatDate } from '../utils/formatDate';

describe('formatDate', () => {
  it('should return a formatted date string, when given a Date', () => {
    const date = new Date(1977, 9, 13);
    expect(formatDate(date)).toEqual('1977-10-13');
  });
  it('should return a formatted date string, when given a string date', () => {
    const date = '2013-06-04T00:00:00.000Z';

    expect(formatDate(date)).toEqual('2013-06-04');
  });
  it('should return an empty string, when given an invalid date string', () => {
    const date = 'Masters of the universe';

    expect(formatDate(date)).toEqual('');
  });
});
