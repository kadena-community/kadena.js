import { createExp } from '../createExp';

test('Takes in Pact function and arguments and outputs Pact code', () => {
  const actual = createExp('+', 2, 3);
  const expected = '(+ 2 3)';

  expect(expected).toEqual(actual);
});
