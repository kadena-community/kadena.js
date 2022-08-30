import { PactNumber } from '../PactNumber';

describe('Pact Number', () => {
  it('Takes in a big integer string as PactNumber and print it as an integer', () => {
    const actual = new PactNumber('900719925474099100001').toInteger();
    const expected = '900719925474099100001';

    expect(expected).toEqual(actual);
  });

  it('Takes in a big integer string as PactNumber and print it as a Pact integer object', () => {
    const actual = new PactNumber('900719925474099100001').toPactInteger();
    const expected = { int: '900719925474099100001' };

    expect(expected).toEqual(actual);
  });

  it('Takes in a big integer string as PactNumber and convert and print as a decimal', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toStringifiedInteger();
    const expected = JSON.stringify('900719925474099100001');

    expect(expected).toEqual(actual);
  });

  it('Takes in a big integer string as PactNumber and convert and print as a decimal', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toDecimal();
    const expected = '900719925474099100001.0';

    expect(expected).toEqual(actual);
  });

  it('Takes in a big integer string as PactNumber and convert and print as a stringified decimal', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toStringifiedDecimal();
    const expected = JSON.stringify('900719925474099100001.0');

    expect(expected).toEqual(actual);
  });

  it('Takes in a big integer string as PactNumber and convert and print as a Pact decimal object', () => {
    const pactNumber = new PactNumber('900719925474099100001');
    const actual = pactNumber.toPactDecimal();
    const expected = { decimal: '900719925474099100001.0' };

    expect(expected).toEqual(actual);
  });

  it('Takes in a big decimal string as PactNumber and print as a Pact decimal object', () => {
    const pactNumber = new PactNumber('-0.9007199254740991192919');
    const actual = pactNumber.toDecimal();
    const expected = '-0.9007199254740991192919';

    expect(expected).toEqual(actual);
  });

  it('Takes in a big decimal string as PactNumber and print as a Pact decimal object', () => {
    const pactNumber = new PactNumber('-0.9007199254740991192919');
    const actual = pactNumber.toPactDecimal();
    const expected = { decimal: '-0.9007199254740991192919' };

    expect(expected).toEqual(actual);
  });

  it('Takes in a big decimal string as PactNumber and print as a stringified decimal', () => {
    const pactNumber = new PactNumber('-0.9007199254740991192919');
    const actual = pactNumber.toStringifiedDecimal();
    const expected = JSON.stringify('-0.9007199254740991192919');

    expect(expected).toEqual(actual);
  });

  it('should throw an error when toInteger is called with a decimal', () => {
    expect(() => {
      new PactNumber('-0.9007199254740991192919').toInteger();
    }).toThrowError('PactNumber is not an integer');
  });

  it('should throw an error when toPactInteger is called with a decimal', () => {
    expect(() => {
      new PactNumber('-0.9007199254740991192919').toPactInteger();
    }).toThrowError('PactNumber is not an integer');
  });

  it('should throw an error when NaN is inputted ', () => {
    expect(() => {
      new PactNumber('a');
    }).toThrowError('Value is NaN');
  });

  it('should take in big integer number as PactNumber, but precisions are lost', () => {
    const actual = new PactNumber(900719925474099100001).toInteger();
    const expected = '900719925474099100000';

    expect(expected).toEqual(actual);
  });

  it('should take big decimal number as PactNumber, but precisions are lost', () => {
    const actual = new PactNumber(0.9007199254740991192919).toDecimal();
    const expected = '0.9007199254740991';

    expect(expected).toEqual(actual);
  });
});
