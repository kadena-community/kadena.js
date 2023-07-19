import { literal, readKeyset } from '../pact-helpers';

describe('readKeyset', () => {
  it('returns read-keyset string', () => {
    expect(readKeyset('ks')()).toBe('(read-keyset "ks")');
  });
});

describe('literal', () => {
  it('returns a function that returns the input', () => {
    expect(literal('free.contract')()).toBe('free.contract');
  });
});
