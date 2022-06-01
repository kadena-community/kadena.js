import mkExp from '../mkExp';

test('Takes in Pact function and arguments and outputs Pact code', () => {
  var actual = mkExp('+', 2, 3);
  var expected = '(+ 2 3)';

  expect(expected).toEqual(actual);
});
