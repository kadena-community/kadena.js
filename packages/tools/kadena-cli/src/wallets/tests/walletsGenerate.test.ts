import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';

const root = path.join(__dirname, '../../../');

describe('create wallet', () => {
  it('Should create a encrypted seed and store it', async () => {
    const { wallet, words } = await services.wallet.create({
      alias: 'test',
      legacy: false,
      password: '123123123',
    });

    const filePath = path.join(root, '.kadena/wallets/test.yaml');
    expect(words.split(' ')).toHaveLength(12);
    expect(wallet.filepath).toEqual(filePath);

    const walletFile = await services.filesystem.readFile(filePath);
    expect(walletFile).toBeTruthy();
  });
});
