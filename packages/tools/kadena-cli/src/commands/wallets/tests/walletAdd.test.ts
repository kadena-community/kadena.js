import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { mockPrompts, runCommandJson } from '../../../utils/test.util.js';

describe('wallet add', () => {
  const walletPath = path.join(WORKING_DIRECTORY, '.kadena/wallets/test.yaml');

  afterEach(async () => {
    await services.wallet.delete(walletPath);
  });

  it('Should add a wallet', async () => {
    const wallet = await runCommandJson('wallet add -w test --quiet', {
      stdin: '123123123',
    });

    expect(wallet.wallet.filepath).toEqual(walletPath);
    expect(await services.filesystem.fileExists(walletPath)).toBe(true);
  });

  it('Should add a wallet with prompts', async () => {
    mockPrompts({
      input: {
        'Not using a password': 'y',
      },
      select: {
        'Create an account': 'false',
      },
      password: {
        'Enter the new wallet password': '',
      },
    });

    const wallet = await runCommandJson('wallet add -w test');

    expect(wallet.wallet.filepath).toEqual(walletPath);
    expect(await services.filesystem.fileExists(walletPath)).toBe(true);
  });
});
