import { createPactInteger } from '../createPactInteger';

import { throws } from 'assert';

describe('createPactInteger', () => {
  it('should create a pact integer object with big integer', () => {
    const actual = createPactInteger('90071992547409910000');
    const expected = { int: '90071992547409910000' };

    expect(expected).toEqual(actual);
  });

  it('should create a pact integer object with small negative integer', () => {
    const actual = createPactInteger('-90071992547409910000');
    const expected = { int: '-90071992547409910000' };

    expect(expected).toEqual(actual);
  });

  it('should throw an error when non-integer is submitted', () => {
    throws(() => createPactInteger('-90071992547409910000.1'));
  });

  it('should throw an error when NaN is submitted', () => {
    throws(() => 'a');
  });
});
