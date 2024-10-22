import { describe, test } from 'vitest';
import { walletSdk } from '../walletSdk.js';

describe('getTransfers', () => {
  test('runs', async () => {
    const result = await walletSdk.getTransfers(
      'k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3',
      'testnet04',
    );
    console.log(result);
  });
});
