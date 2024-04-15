import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';

describe('wallet generate-key command', () => {
  it('should generate hd keys correctly correctly', async () => {
    const mnemonic =
      'finish heavy silly hood pact broccoli remove fork throw master grant cabin';
    const alias = 'test-wallet';
    const walletPassword = '12345678';

    let wallet = await services.wallet.import({
      mnemonic,
      password: walletPassword,
      alias,
      legacy: false,
    });

    const key = await services.wallet.generateKey({
      seed: wallet.seed,
      legacy: wallet.legacy,
      password: walletPassword,
      index: 0,
    });

    wallet = await services.wallet.storeKey(wallet, key);

    expect(key.index).toBe(0);
    expect(key.publicKey).toEqual(
      '8d1642e193e155e456824e0f5bb0182af09a4df9a3c9d573b5c4978b26926e74',
    );
    expect(wallet.keys.length).toBe(1);
    expect(wallet.keys[0].publicKey).toBe(key.publicKey);
    expect(wallet.keys[0].index).toBe(key.index);
  });

  it('should generate hd keys with range correctly correctly', async () => {
    const mnemonic =
      'finish heavy silly hood pact broccoli remove fork throw master grant cabin';
    const alias = 'test-wallet2';
    const walletPassword = '12345678';

    let wallet = await services.wallet.import({
      mnemonic,
      password: walletPassword,
      alias,
      legacy: false,
    });

    for (let i = 0; i < 3; i++) {
      const key = await services.wallet.generateKey({
        seed: wallet.seed,
        legacy: wallet.legacy,
        password: walletPassword,
        index: i,
      });
      wallet = await services.wallet.storeKey(wallet, key);
    }

    expect(wallet.legacy).toBe(false);
    expect(wallet.keys.length).toBe(3);
    expect(wallet.keys[0].publicKey).toEqual(
      '8d1642e193e155e456824e0f5bb0182af09a4df9a3c9d573b5c4978b26926e74',
    );
    expect(wallet.keys[1].publicKey).toEqual(
      '55251db385f82e06636baeb603091a2be467e5aa9baa07f74b133037d818463f',
    );
    expect(wallet.keys[2].publicKey).toEqual(
      '0a211b1533482e7ef8b280455dd51f9ce0bdb62ebf2348c75c0918b3706f73d4',
    );
  });
});
