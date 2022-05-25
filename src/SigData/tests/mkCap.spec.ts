import mkCap from '../mkCap';

test('should create a baseline cap', () => {
  const actual = mkCap('coin.GAS');
  const expected = { name: 'coin.GAS', args: [] };

  expect(expected).toEqual(actual);
});

test('should create a TRANSFER cap with arguments', () => {
  const actual = mkCap('coin.TRANSFER', ['fromAcctName', 'toAcctName', 0.1]);
  const expected = { name: 'coin.TRANSFER', args: ['fromAcctName', 'toAcctName', 0.1] };

  expect(expected).toEqual(actual);
});
