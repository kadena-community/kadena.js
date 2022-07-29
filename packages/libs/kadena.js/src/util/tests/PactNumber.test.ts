import { PactNumber } from '../PactNumber';

import { throws } from 'assert';

describe('toPactInteger', () => {
  it('should print an integer string', () => {
    const pactNumber = new PactNumber('90071992547409910000');
    const actual = pactNumber.toInteger();
    const expected = '90071992547409910000';

    expect(expected).toEqual(actual);
  });

  it('should create a pact integer object with big positive integer', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toPactInteger();
    const expected = { int: '900719925474099100001' };

    expect(expected).toEqual(actual);
  });

  it('should convert an integer to a decimal and print in string', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toPactDecimal();
    const expected = { decimal: '900719925474099100001' };

    expect(expected).toEqual(actual);
  });

  it('should convert an integer to a decimal and print in pact decimal object', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toPactDecimal();
    const expected = { decimal: '900719925474099100001' };

    expect(expected).toEqual(actual);
  });

  it('should create a pact decimal object with very small negative decimal', () => {
    const pactNumber = new PactNumber('-0.90071992547409910000');
    const actual = pactNumber.toPactDecimal();
    const expected = { decimal: '-0.9007199254740991' };

    expect(expected).toEqual(actual);
  });

  it('should throw an error when toInteger is called with a decimal', () => {
    throws(() => {
      new PactNumber('-0.90071992547409910000').toInteger();
    });
  });

  it('should throw an error when toPactInteger is called with a decimal', () => {
    throws(() => {
      new PactNumber('-0.90071992547409910000').toPactInteger();
    });
  });

  it('should throw an error when NaN is inputted ', () => {
    throws(() => {
      new PactNumber('a');
    });
  });

  it('should take in number as PactNumber', () => {
    const actual = new PactNumber(9007199254740991000).toInteger();
    const expected = '9007199254740991000';

    expect(expected).toEqual(actual);
  });

  it('should take in number as PactNumber', () => {
    const actual = new PactNumber(0.9007199254740991).toDecimal();
    const expected = '0.9007199254740991';

    expect(expected).toEqual(actual);
  });
});
