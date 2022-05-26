import mkCap from '../mkCap';

test('should create a baseline cap with empty args', () => {
  const actual = mkCap('coin.GAS');
  const expected = { name: 'coin.GAS', args: [] };

  expect(expected).toEqual(actual);
});

test('should create a cap with multiple arguments', () => {
  const actual = mkCap('coin.TRANSFER', ['fromAcctName', 'toAcctName', 0.1]);
  const expected = { name: 'coin.TRANSFER', args: ['fromAcctName', 'toAcctName', 0.1] };

  expect(expected).toEqual(actual);
});

test('should create a cap with a boolean argument', () => {
  const actual = mkCap('coin.TEST', [true]);
  const expected = { name: 'coin.TEST', args: [true] };

  expect(expected).toEqual(actual);
});

test('should create a cap with an array of pact values', () => {
  const actual = mkCap('coin.TEST', [[true, 'randomStr', [1.234]], 200000]);
  const expected = { name: 'coin.TEST', args: [[true, 'randomStr', [1.234]], 200000] };

  expect(expected).toEqual(actual);
});

test("should create a cap with JavaScript's Number.MAX_SAFE_INTEGER", () => {
  const actual = mkCap('coin.TEST', [Number.MAX_SAFE_INTEGER]);
  const expected = { name: 'coin.TEST', args: [9007199254740991] };

  expect(expected).toEqual(actual);
});

test("should create a cap with JavaScript's Number.MIN_SAFE_INTEGER", () => {
  const actual = mkCap('coin.TEST', [Number.MIN_SAFE_INTEGER]);
  const expected = { name: 'coin.TEST', args: [-9007199254740991] };

  expect(expected).toEqual(actual);
});
