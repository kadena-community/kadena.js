import { createPactDecimal } from '../createPactDecimal';

import { throws } from 'assert';

describe('createPactDecimal', () => {
  it('should create a pact integer object with big positive decimal', () => {
    const actual = createPactDecimal('0.90071992547409910000');
    const expected = { decimal: '0.90071992547409910000' };

    expect(expected).toEqual(actual);
  });

  it('should create a pact integer object with very small negative decimal', () => {
    const actual = createPactDecimal('-0.90071992547409910000');
    const expected = { decimal: '-0.90071992547409910000' };

    expect(expected).toEqual(actual);
  });

  it('should throw an error when NaN is submitted', () => {
    throws(() => createPactDecimal('a'));
  });
});
