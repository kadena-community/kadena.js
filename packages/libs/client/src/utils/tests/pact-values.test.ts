import { readKeyset } from '../pact-values';

describe('readKeyset', () => {
  it('returns read-keyset string', () => {
    expect(readKeyset('ks')()).toBe('(read-keyset "ks")');
  });
});
