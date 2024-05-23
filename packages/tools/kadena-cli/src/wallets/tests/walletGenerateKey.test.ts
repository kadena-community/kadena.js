import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommandJson } from '../../utils/test.util.js';

describe('wallet generate-key command', () => {
  const root = path.join(__dirname, '../../../');
  const walletPath = path.join(root, '.kadena/wallets/test.yaml');
  const password = '12345678';
  const mnemonic =
    'regular scissors hybrid step warfare dinosaur caught option phrase bitter situate yard';

  beforeEach(async () => {
    const mnemonicFile = path.join(root, 'mnemonic.txt');
    await services.filesystem.writeFile(mnemonicFile, mnemonic);
    const pwFile = path.join(root, 'pw.txt');
    await services.filesystem.writeFile(pwFile, password);

    await runCommandJson(
      `wallet import --quiet -w test --mnemonic-file ${mnemonicFile} --password-file ${pwFile}`,
    );
  });

  afterEach(async () => {
    await services.filesystem.deleteFile(walletPath);
  });

  it('Should create a new wallet key', async () => {
    await runCommandJson('wallet generate-key -w test --quiet', {
      stdin: password,
    });
    const wallet = await services.wallet.get(walletPath);
    expect(wallet?.keys.length).toEqual(2);
    expect(wallet?.keys[1].publicKey).toEqual(
      'bb41db810d02b70e18a18e733dd2b7fc313cb229cefeb8f89cd88406d860472b',
    );
  });

  it('Should create a new wallet key using prompts', async () => {
    mockPrompts({
      input: {
        'Amount of keys to generate': '1',
        'Alias for the generated key': '',
      },
      select: {
        'Select a wallet': 'test',
      },
      password: {
        'Enter the wallet password': password,
      },
    });
    await runCommandJson('wallet generate-key');
    const wallet = await services.wallet.get(walletPath);
    expect(wallet?.keys.length).toEqual(2);
    expect(wallet?.keys[1].publicKey).toEqual(
      'bb41db810d02b70e18a18e733dd2b7fc313cb229cefeb8f89cd88406d860472b',
    );
  });

  it('Should create 3 new wallet keys with start index', async () => {
    await runCommandJson('wallet generate-key -w test -n 3 -i 5 --quiet', {
      stdin: password,
    });
    const wallet = await services.wallet.get(walletPath);

    expect(wallet?.keys).toEqual([
      {
        index: 0,
        publicKey:
          'f2e08d07b7a0f399917aadd90584a8485939660effd665e7d36b4b820210b262',
      },
      {
        index: 5,
        publicKey:
          '43909df9913bd4c733f6c0908d204f800ae5a482057ea051ca90807505974b1b',
      },
      {
        index: 6,
        publicKey:
          '0d320cedc938e63a28b419aa6c9becc349cdbbc77465ce0b04d115645f058c47',
      },
      {
        index: 7,
        publicKey:
          'bfd2381431903246c8da36396cb7342ace2308af3d790c97733038eae2ebfc18',
      },
    ]);
  });
});
