import path from 'node:path';
import { afterEach } from 'node:test';
import {} from 'ora';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommandJson } from '../../utils/test.util.js';

describe('wallet import command', () => {
  const root = path.join(__dirname, '../../../');
  const walletPath = path.join(root, '.kadena/wallets/test.yaml');

  const mnemonic =
    'regular scissors hybrid step warfare dinosaur caught option phrase bitter situate yard';
  const password = '12345678';

  afterEach(async () => {
    await services.filesystem.deleteFile(walletPath);
  });

  it('should import a wallet with mnemonic', async () => {
    const mnemonicFile = path.join(root, 'mnemonic.txt');
    await services.filesystem.writeFile(mnemonicFile, mnemonic);
    const pwFile = path.join(root, 'pw.txt');
    await services.filesystem.writeFile(pwFile, password);

    const result = await runCommandJson(
      `wallet import --quiet -w test --mnemonic-file ${mnemonicFile} --password-file ${pwFile}`,
    );

    const wallet = await services.wallet.get(result.wallet.filepath);

    expect(wallet).toBeTruthy();
    expect(wallet!.keys[0].publicKey).toEqual(
      'f2e08d07b7a0f399917aadd90584a8485939660effd665e7d36b4b820210b262',
    );
  });

  it('should import a wallet with mnemonic using prompts', async () => {
    mockPrompts({
      verbose: true,
      input: {
        'Enter your 12-word mnemonic phrase': mnemonic,
        'Enter your wallet name': 'test',
      },
      password: {
        'Enter the new wallet password': password,
        'Re-enter the password': password,
      },
    });

    const result = await runCommandJson('wallet import');

    const wallet = await services.wallet.get(result.wallet.filepath);

    expect(wallet).toBeTruthy();
    expect(wallet!.keys[0].publicKey).toEqual(
      'f2e08d07b7a0f399917aadd90584a8485939660effd665e7d36b4b820210b262',
    );
  });
});
