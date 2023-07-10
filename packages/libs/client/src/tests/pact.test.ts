import { Pact } from '../pact';

describe('Pact.modules', () => {
  it('returns pact string equivalent of a function call', () => {
    const code = (Pact.modules as any).coin.transfer('alice', 'bob', {
      decimal: '1',
    });
    expect(code).toBe('(coin.transfer "alice" "bob" 1.0)');
  });

  it('returns pact string equivalent of a defpact call', () => {
    const code = (Pact.modules as any).coin.defpact['transfer-crosschain'](
      'alice',
      'bob',
      () => 'myGuard',
      '1',
      { decimal: '1' },
    );
    expect(code).toBe(
      '(coin.transfer-crosschain "alice" "bob" myGuard "1" 1.0)',
    );
  });
});
