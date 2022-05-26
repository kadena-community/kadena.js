import { mkPactInt } from '../PactValue';

test('should create a pact integer object with big integer', () => {
  const actual = mkPactInt('90071992547409910000');
  const expected = { int: '90071992547409910000'};

  expect(expected).toEqual(actual);
});

test('should create a pact integer object with small negative integer', () => {
    const actual = mkPactInt('-90071992547409910000');
    const expected = { int: '-90071992547409910000'};

    expect(expected).toEqual(actual);
  });
