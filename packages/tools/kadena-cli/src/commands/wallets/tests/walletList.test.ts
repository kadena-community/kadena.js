import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { runCommandJson } from '../../../utils/test.util.js';

describe('wallet list command', () => {
  const walletPath = path.join(WORKING_DIRECTORY, '.kadena/wallets/test.yaml');

  afterEach(async () => {
    await services.filesystem.deleteFile(walletPath);
  });

  it('list existing wallets', async () => {
    await runCommandJson('wallet add -w test --quiet', {
      stdin: '12345678',
    });
    await runCommandJson('wallet add -w test2 --quiet', {
      stdin: '12345678',
    });

    const result = await runCommandJson(`wallet list -w all --quiet`);
    expect(result.test.filepath).toEqual(walletPath);
    expect(result.test.seed).toEqual(undefined);
    expect(result.test.legacy).toEqual(false);
    expect(result.test.keys.length).toEqual(1);

    expect(result.test2.filepath).contains('.kadena/wallets/test2.yaml');
    expect(result.test2.seed).toEqual(undefined);
    expect(result.test2.legacy).toEqual(false);
    expect(result.test2.keys.length).toEqual(1);
  });

  it('list specific wallets', async () => {
    await runCommandJson('wallet add -w test --quiet', {
      stdin: '12345678',
    });

    const result = await runCommandJson(`wallet list -w test --quiet`);
    expect(result.filepath).toEqual(walletPath);
    expect(result.seed).toEqual(undefined);
    expect(result.legacy).toEqual(false);
    expect(result.keys.length).toEqual(1);
  });
});
