import { describe, test } from 'vitest';
import { walletSdk } from '../walletSdk.js';

describe('getTransfers', () => {
  test('runs', async () => {
    const result = await walletSdk.getTransfers(
      'k:9d416e1accc280d9539314233c7827b08aa0154cd320873088e9b9ea74a37462',
      'testnet04',
    );
    console.log(result);
  });
});
