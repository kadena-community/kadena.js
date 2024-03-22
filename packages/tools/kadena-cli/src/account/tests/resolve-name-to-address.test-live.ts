import { describe, expect, it } from 'vitest';
import { assertCommandError } from '../../utils/command.util.js';
import { resolveNameToAddress } from '../commands/accountResolveNameToAddress.js';

describe('resolveAddressToName functionality', () => {
  // NOTE: this tests uses live mainnet01 meaning it is not isolated!!!
  // No known names on test network
  it('resolves a address name from a .kda name', async () => {
    const network = 'mainnet';
    const networkId = 'mainnet01';
    const networkHost = 'https://api.chainweb.com';
    const testName = 'randy.kda';

    const result = await resolveNameToAddress(
      testName,
      network,
      networkId,
      networkHost,
    );
    assertCommandError(result);

    expect(result.status).toBe('success');
    expect(result.data.commands).toBeDefined();
    expect(result.data.commands).toBe(
      'k:235fa197fa8de8615d4db0b1ad250c4f716a98e0213f29ba2060e60f1dbf56bd',
    );
  });
});
