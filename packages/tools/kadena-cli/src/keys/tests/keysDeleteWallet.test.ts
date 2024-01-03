import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { deleteWallet } from '../commands/keysDeleteWallet.js';
import { generateWallet } from '../commands/keysWalletGenerate.js';

const root = path.join(__dirname, '../../../');

describe('delete wallet', () => {
  it('Should delete a specific wallet', async () => {
    const walletPath = path.join(root, '.kadena/wallets/test/test.wallet');

    await generateWallet('test', '12345678', false);

    expect(await services.filesystem.fileExists(walletPath)).toBe(true);

    await deleteWallet('test');

    expect(await services.filesystem.fileExists(walletPath)).toBe(false);
  });

  it('Should delete all wallets', async () => {
    const walletPath = path.join(root, '.kadena/wallets');

    await generateWallet('test', '12345678', false);

    expect(await services.filesystem.directoryExists(walletPath)).toBe(true);

    await deleteWallet('all');

    expect(await services.filesystem.directoryExists(walletPath)).toBe(false);
  });
});
