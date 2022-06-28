import createExp from '../createExp';

test('Takes in Pact function and arguments and outputs Pact code', () => {
  var actual = createExp('+', 2, 3);
  var expected = '(+ 2 3)';

  expect(expected).toEqual(actual);
});
