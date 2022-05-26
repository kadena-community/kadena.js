import { mkPactDecimal } from '../PactValue';

test('should create a pact integer object with big positive decimal', () => {
  const actual = mkPactDecimal('0.90071992547409910000');
  const expected = { decimal: '0.90071992547409910000'};

  expect(expected).toEqual(actual);
});

test('should create a pact integer object with very small negative decimal', () => {
    const actual = mkPactDecimal('-0.90071992547409910000');
    const expected = { decimal: '-0.90071992547409910000'};

    expect(expected).toEqual(actual);
  });
