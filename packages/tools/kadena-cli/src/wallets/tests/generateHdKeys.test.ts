import { assert, describe, expect, it } from 'vitest';
import { generateHdKeys } from '../commands/walletsHdGenerate.js';
import { importWallet } from '../commands/walletsImportWallet.js';

describe('generate hd keys command', () => {
  it('should generate hd keys correctly correctly', async () => {
    const mnemonic =
      'finish heavy silly hood pact broccoli remove fork throw master grant cabin';
    const walletName = 'test-wallet';
    const walletPassword = '12345678';
    const keyName = 'test-key';

    const wallet = await importWallet({
      mnemonic,
      password: walletPassword,
      walletName,
    });
    assert(wallet.success);

    const keys = await generateHdKeys({
      keyAlias: keyName,
      keyGenFromChoice: 'genPublicSecretKey',
      keyIndexOrRange: 1,
      password: walletPassword,
      walletName: wallet.data.wallet.wallet,
    });
    assert(keys.success);

    expect(keys.data.legacy).toBe(false);
    expect(keys.data.startIndex).toBe(1);
    expect(keys.data.keys[0].publicKey).toEqual(
      '55251db385f82e06636baeb603091a2be467e5aa9baa07f74b133037d818463f',
    );
    expect(keys.data.keys[0].secretKey).toBeTruthy();
  });
  it('should generate hd keys with range correctly correctly', async () => {
    const mnemonic =
      'finish heavy silly hood pact broccoli remove fork throw master grant cabin';
    const walletName = 'test-wallet';
    const walletPassword = '12345678';
    const keyName = 'test-key';

    const wallet = await importWallet({
      mnemonic,
      password: walletPassword,
      walletName: walletName,
    });
    assert(wallet.success);

    const keys = await generateHdKeys({
      keyAlias: keyName,
      keyGenFromChoice: 'genPublicSecretKey',
      keyIndexOrRange: [1, 3],
      password: walletPassword,
      walletName: wallet.data.wallet.wallet,
    });
    assert(keys.success);

    expect(keys.data.legacy).toBe(false);
    expect(keys.data.startIndex).toBe(1);

    // secretKeys are encrypted and salted so we can't assert their content

    expect(keys.data.keys[0].publicKey).toEqual(
      '55251db385f82e06636baeb603091a2be467e5aa9baa07f74b133037d818463f',
    );
    expect(keys.data.keys[0].secretKey).toBeTruthy();

    expect(keys.data.keys[1].publicKey).toEqual(
      '0a211b1533482e7ef8b280455dd51f9ce0bdb62ebf2348c75c0918b3706f73d4',
    );
    expect(keys.data.keys[1].secretKey).toBeTruthy();

    expect(keys.data.keys[2].publicKey).toEqual(
      'ab4a0cb6420dfc1a622d9ac1c72bad5d71a2cf11bb4513657b2cb8c633f48281',
    );
    expect(keys.data.keys[2].secretKey).toBeTruthy();
  });
});
