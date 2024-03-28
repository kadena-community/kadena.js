import type { EncryptedString } from '@kadena/hd-wallet';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';

describe('wallet export command', () => {
  it('should decrypt a message correctly', async () => {
    const seed =
      'R0hiSzI4aEZxa2ZJSnI1UGZxQTkwZz09LmxidlJXZzNsbndsQmIrVEkudkZ0bEduYVp6MzJuVTlvdWlZRUpFWG9DbmVQTWdxNi9vdWd0VnhWZFpKOHJMZ2t3eGZJUlNCU2txNDhDZ3pvKzgvbHdPWGtYZkVLUVAxK1pVOElCVERKMXp4dnlzSVkrN2FGWGduMHQ0MjQ9' as EncryptedString;
    const password = '12345678';

    // creating a wallet from seed is unusual
    // the method wallet._createFromSeed covers this but it is private
    const walletPath = await services.config.setWallet({
      seed,
      keys: [
        await services.wallet.generateKey({
          index: 0,
          legacy: false,
          password,
          seed,
        }),
      ],
      alias: 'test',
      legacy: false,
    });
    const wallet = (await services.wallet.get(walletPath))!;

    const keypair = await services.wallet.getKeyPair(
      wallet,
      wallet.keys[0],
      password,
    );

    expect(keypair.publicKey).toEqual(
      'b2626fdf6b7a996777aa9b8dc7da6ff63add0803a5dcb3dc006f9da23c64fd67',
    );
    expect(keypair.secretKey).toEqual(
      '02c6f93fa8b99031e0dbb13dab72a2110e0974c18480edee1cd3a3b704dc2813',
    );
  });
});
