import path from 'path';
import { assert, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { deleteWallet } from '../commands/keysDeleteWallet.js';
import { generateWallet } from '../commands/keysWalletGenerate.js';

const root = path.join(__dirname, '../../../');

describe('delete wallet', () => {
  it('Should delete a specific wallet', async () => {
    const walletPath = path.join(root, '.kadena/wallets/test/test.wallet');

    const result1 = await generateWallet('test', '12345678', false);
    assert(result1.success);

    expect(await services.filesystem.fileExists(walletPath)).toBe(true);

    const result = await deleteWallet('test.wallet');
    assert(result.success);

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
