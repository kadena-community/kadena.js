import { sum } from '..';

describe('utils test', () => {
  test('sum', () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
