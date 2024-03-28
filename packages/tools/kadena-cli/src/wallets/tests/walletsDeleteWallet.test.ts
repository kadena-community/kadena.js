import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';

const root = path.join(__dirname, '../../../');

describe('delete wallet', () => {
  it('Should delete a specific wallet', async () => {
    const walletPath = path.join(root, '.kadena/wallets/test.yaml');

    await services.wallet.create({
      alias: 'test',
      legacy: false,
      password: '123123123',
    });

    expect(await services.filesystem.fileExists(walletPath)).toBe(true);

    const walletContent = await services.wallet.get(walletPath);

    if (!walletContent) {
      throw new Error('Wallet content not found');
    }

    await services.wallet.delete(walletPath);

    expect(await services.filesystem.fileExists(walletPath)).toBe(false);
  });
});
