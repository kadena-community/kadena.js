import { describe, expect, it } from 'vitest';
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

  it('extends plus form the BigNumber class', () => {
    const actual = new PactNumber('0.9007199254740991192919');
    const pactDecimal = actual.plus(1).toPactDecimal();
    expect(pactDecimal).toStrictEqual({ decimal: '1.9007199254740991192919' });
  });

  it('extends minus form the BigNumber class', () => {
    const actual = new PactNumber('0.9007199254740991192919');
    const pactDecimal = actual.minus('0.9').toPactDecimal();
    expect(pactDecimal).toStrictEqual({ decimal: '0.0007199254740991192919' });
  });

  it('does not return scientific notation for large integer', () => {
    const number = new PactNumber(
      '0x584712a2542d5c1ab3cd25dec0b14e53aef270e6948140656a8fbf3d2829c729',
    );
    const int = number.toPactInteger();

    expect(int).toEqual({
      int: '39929105424737202205146861475763790532040240744253228361760383139526688229161',
    });
  });

  it('does not return scientific notation for large decimals', () => {
    const number = new PactNumber(
      '3.9929105424737202205146861475763790532040240744253228361760383139526688229161',
    );
    const decimal = number.toPactDecimal();

    expect(decimal).toEqual({
      decimal:
        '3.9929105424737202205146861475763790532040240744253228361760383139526688229161',
    });
  });
});
