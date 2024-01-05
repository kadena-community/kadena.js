import { assert, describe, expect, it } from 'vitest';
import { generateHdKeys } from '../commands/keysHdGenerate.js';
import { generateWallet } from '../commands/keysWalletGenerate.js';

describe('generate hd keys command', () => {
  it('should generate hd keys correctly correctly', async () => {
    const walletName = 'test-wallet';
    const walletPassword = '12345678';
    const keyName = 'test-key';

    // TODO: change to import wallet so the output can be asserted better
    const wallet = await generateWallet(walletName, walletPassword, false);
    assert(wallet.success);

    const keys = await generateHdKeys({
      keyAlias: keyName,
      keyGenFromChoice: 'genPublicSecretKey',
      keyIndexOrRange: 1,
      password: walletPassword,
      walletName: walletName,
    });
    assert(keys.success);

    expect(keys.data.legacy).toBe(false);
    expect(keys.data.startIndex).toBe(1);
    expect(keys.data.keys[0].publicKey).toBeTruthy();
    expect(keys.data.keys[0].secretKey).toBeTruthy();
  });
  it('should generate hd keys with range correctly correctly', async () => {
    const walletName = 'test-wallet';
    const walletPassword = '12345678';
    const keyName = 'test-key';

    // TODO: change to import wallet so the output can be asserted better
    const wallet = await generateWallet(walletName, walletPassword, false);
    assert(wallet.success);

    const keys = await generateHdKeys({
      keyAlias: keyName,
      keyGenFromChoice: 'genPublicSecretKey',
      keyIndexOrRange: [1, 3],
      password: walletPassword,
      walletName: walletName,
    });
    assert(keys.success);

    expect(keys.data.legacy).toBe(false);
    expect(keys.data.startIndex).toBe(1);
    expect(keys.data.keys[0].publicKey).toBeTruthy();
    expect(keys.data.keys[0].secretKey).toBeTruthy();

    expect(keys.data.keys[1].publicKey).toBeTruthy();
    expect(keys.data.keys[1].secretKey).toBeTruthy();

    expect(keys.data.keys[2].publicKey).toBeTruthy();
    expect(keys.data.keys[2].secretKey).toBeTruthy();
  });
});
