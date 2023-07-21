import { Pact } from '../pact';
import { literal, readKeyset } from '../utils/pact-helpers';

describe('Pact.modules', () => {
  it('returns pact string equivalent of a function call', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const code = (Pact.modules as any).coin.transfer('alice', 'bob', {
      decimal: '1',
    });
    expect(code).toBe('(coin.transfer "alice" "bob" 1.0)');
  });

  it('returns pact string equivalent of a defpact call', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  it('returns code for time and module reference', () => {
    const now = new Date('2023-07-19T10:04:15.599Z');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const code = (Pact.modules as any).crowdfund['create-project'](
      'id',
      'an awesome project',
      literal('coin'),
      { decimal: '1000' },
      { decimal: '800' },
      now,
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      'bob',
      readKeyset('ks'),
    );
    expect(code).toBe(
      '(crowdfund.create-project "id" "an awesome project" coin 1000.0 800.0 (time "2023-07-19T10:04:15Z") (time "2023-08-18T10:04:15Z") "bob" (read-keyset "ks"))',
    );
  });
});
