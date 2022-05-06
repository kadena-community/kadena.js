import mkCap from '../mkCap';

test('should create a baseline cap', () => {
  const actual = mkCap('coin.GAS');
  const expected = { name: 'coin.GAS', args: [] };

  expect(expected).toEqual(actual);
});
