import { describe, expect, it } from 'vitest';
import { assertCommandError } from '../../utils/command.util.js';
import { resolveAddressToName } from '../commands/accountResolveAddressToName.js';

describe('resolveAddressToName functionality', () => {
  // NOTE: this tests uses live mainnet01 meaning it is not isolated!!!
  // No known names on test network
  it('resolves a .kda name from an address', async () => {
    const network = 'mainnet';
    const networkId = 'mainnet01';
    const networkHost = 'https://api.chainweb.com';
    const testAddress =
      'k:235fa197fa8de8615d4db0b1ad250c4f716a98e0213f29ba2060e60f1dbf56bd';

    const result = await resolveAddressToName(
      testAddress,
      network,
      networkId,
      networkHost,
    );
    assertCommandError(result);

    expect(result.status).toBe('success');
    expect(result.data.commands).toBeDefined();
    expect(result.data.commands).toBe('randy.kda');
  });
});
