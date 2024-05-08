import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommandJson } from '../../utils/test.util.js';

describe('delete wallet', () => {
  const root = path.join(__dirname, '../../../');
  const walletPath = path.join(root, '.kadena/wallets/test.yaml');

  beforeEach(async () => {
    const wallet = await services.wallet.create({
      alias: 'test',
      legacy: false,
      password: '123123123',
    });

    expect(wallet.wallet.filepath).toEqual(walletPath);
    expect(await services.filesystem.fileExists(walletPath)).toBe(true);
  });

  it('Should delete a specific wallet', async () => {
    const res = await runCommandJson([
      'wallet',
      'delete',
      '-w',
      'test',
      '-c',
      '--quiet',
    ]);
    expect(res.deleted).toEqual(['test']);

    expect(await services.filesystem.fileExists(walletPath)).toBe(false);
  });

  it('Should delete a specific wallet with prompts', async () => {
    mockPrompts({
      input: {
        'Are you sure you want to delete the wallet': 'yes',
      },
      select: {
        'Select a wallet': 'test',
        'Are you sure': true,
      },
    });

    const res = await runCommandJson(['wallet', 'delete']);
    expect(res.deleted).toEqual(['test']);

    expect(await services.filesystem.fileExists(walletPath)).toBe(false);
  });
});
