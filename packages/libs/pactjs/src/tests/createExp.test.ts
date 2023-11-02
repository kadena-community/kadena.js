import { describe, expect, it } from 'vitest';
import { PactNumber } from '../PactNumber';
import { createExp } from '../createExp';

describe('createExp', () => {
  it('Takes in Pact function and arguments and outputs Pact code', () => {
    const actual = createExp('+', 2, 3);
    const expected = '(+ 2 3)';

    expect(expected).toEqual(actual);
  });

  it('Takes in Pact function and arguments using PactNumber and outputs Pact code', () => {
    const actual = createExp(
      '+',
      new PactNumber('2').toInteger(),
      new PactNumber('3').toDecimal(),
    );
    const expected = '(+ 2 3.0)';

    expect(expected).toEqual(actual);
  });

  it('Takes in Pact function and stringified number arguments using PactNumber and outputs Pact code', () => {
    const actual = createExp(
      '+',
      new PactNumber('2').toStringifiedInteger(),
      new PactNumber('3').toStringifiedDecimal(),
    );
    const expected = '(+ "2" "3.0")';

    expect(expected).toEqual(actual);
  });

  it('does not add a space when only a function is called', () => {
    const expr = createExp('fn');
    const expected = '(fn)';

    expect(expr).toBe(expected);
  });
});
