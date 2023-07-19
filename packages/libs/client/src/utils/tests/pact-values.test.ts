import { decimal, integer, readKeyset, reference } from '../pact-values';

describe('readKeyset', () => {
  it('returns read-keyset string', () => {
    expect(readKeyset('ks')()).toBe('(read-keyset "ks")');
  });
});

describe('reference', () => {
  it('returns a function that returns the string = always in FP', () => {
    expect(reference('free.contract')()).toBe('free.contract');
  });
});

describe('decimal', () => {
  it('returns pact decimal object', () => {
    expect(decimal('12')).toEqual({ decimal: '12.0' });
  });
});

describe('integer', () => {
  it('returns pact integer object', () => {
    expect(integer('12')).toEqual({ int: '12' });
  });
});
