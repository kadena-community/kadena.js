import { beforeAll, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommandJson } from '../../utils/test.util.js';

describe('wallet export command', () => {
  const password = '12345678';

  beforeAll(async () => {
    const mnemonic =
      'regular scissors hybrid step warfare dinosaur caught option phrase bitter situate yard';

    const wallet = await services.wallet.import({
      alias: 'test',
      legacy: false,
      mnemonic,
      password,
    });

    await services.wallet.storeKey(
      wallet,
      await services.wallet.generateKey({
        seed: wallet.seed,
        legacy: wallet.legacy,
        password: password,
        index: 0,
      }),
    );
  });

  it('export keypair from wallet', async () => {
    const result = await runCommandJson('wallet export -w test -i 0 --quiet', {
      stdin: password,
    });

    expect(result.publicKey).toEqual(
      'f2e08d07b7a0f399917aadd90584a8485939660effd665e7d36b4b820210b262',
    );
    expect(result.secretKey).toEqual(
      '922bdfcb68d9129b877422f7f0b8afc4f18114eed9bca90061b70ee91a1694b6',
    );
  });

  it('export keypair from wallet using prompts', async () => {
    mockPrompts({
      select: {
        'Select a wallet': 'test',
        'Select a key index': 0,
      },
      password: {
        'Enter the wallet password': password,
      },
    });

    const result = await runCommandJson('wallet export');

    expect(result.publicKey).toEqual(
      'f2e08d07b7a0f399917aadd90584a8485939660effd665e7d36b4b820210b262',
    );
    expect(result.secretKey).toEqual(
      '922bdfcb68d9129b877422f7f0b8afc4f18114eed9bca90061b70ee91a1694b6',
    );
  });
});
