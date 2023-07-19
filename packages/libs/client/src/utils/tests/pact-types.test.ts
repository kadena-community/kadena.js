import { literal, readKeyset } from '../pact-helpers';

describe('readKeyset', () => {
  it('returns read-keyset string', () => {
    expect(readKeyset('ks')()).toBe('(read-keyset "ks")');
  });
});

describe('reference', () => {
  it('returns a function that returns the string = always in FP', () => {
    expect(literal('free.contract')()).toBe('free.contract');
  });
});
