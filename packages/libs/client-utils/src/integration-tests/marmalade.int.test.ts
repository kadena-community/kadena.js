import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { beforeAll, describe, expect, it } from 'vitest';
import { describeModule } from '../built-in';
import { transferCreate } from '../coin';
import type { IClientConfig } from '../core/utils/helpers';
import { createToken } from '../marmalade/create-token';
import { createTokenId } from '../marmalade/create-token-id';
import { getTokenBalance } from '../marmalade/get-token-balance';
import { mintToken } from '../marmalade/mint-token';
import { transferCreateToken } from '../marmalade/transfer-create-token';
import { deployMarmalade } from '../nodejs';
import { NetworkIds } from './support/NetworkIds';
import { withStepFactory } from './support/helpers';
import {
  secondaryTargetAccount,
  sender00Account,
  sourceAccount,
} from './test-data/accounts';

let tokenId: string | undefined;
const chainId = '0' as ChainId;
const inputs = {
  chainId,
  precision: 0,
  uri: Date.now().toString(),
  policies: [],
  creator: {
    account: sourceAccount.account,
    keyset: {
      keys: [sourceAccount.publicKey],
      pred: 'keys-all' as const,
    },
  },
};
const config = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
  },
  sign: createSignWithKeypair([sourceAccount]),
};

beforeAll(async () => {
  const fundConfig: IClientConfig = {
    host: 'http://127.0.0.1:8080',
    defaults: {
      networkId: 'development',
      meta: {
        chainId,
      },
    },
    sign: createSignWithKeypair([sender00Account]),
  };
  let marmaladeDeployed = false;

  try {
    await describeModule('marmalade-v2.ledger', fundConfig);
    marmaladeDeployed = true;
  } catch (error) {
    console.log('Marmalade not deployed, deploying now');
  }

  if (!marmaladeDeployed) {
    await deployMarmalade({
      chainIds: [chainId],
      deleteFilesAfterDeployment: true,
    });
  }

  const [resultSourceAccount, resultTargetAccount] = await Promise.all([
    transferCreate(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all',
          },
        },
        amount: '100',
        chainId,
      },
      fundConfig,
    ).execute(),
    transferCreate(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all',
          },
        },
        amount: '100',
        chainId,
      },
      fundConfig,
    ).execute(),
  ]);

  expect(resultSourceAccount).toBe('Write succeeded');
  expect(resultTargetAccount).toBe('Write succeeded');
}, 300000);

describe('createTokenId', () => {
  it('should return a token id', async () => {
    tokenId = await createTokenId(inputs, config).execute();

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);
  });
});

describe('createToken', () => {
  it('shoud create a token', async () => {
    const withStep = withStepFactory();

    const result = await createToken(
      { ...inputs, tokenId: tokenId as string },
      config,
    )
      .on(
        'sign',
        withStep((step, tx) => {
          expect(step).toBe(1);
          expect(tx.sigs).toHaveLength(1);
          expect(tx.sigs[0].sig).toBeTruthy();
        }),
      )
      .on(
        'preflight',
        withStep((step, prResult) => {
          expect(step).toBe(2);
          if (prResult.result.status === 'failure') {
            expect(prResult.result.status).toBe('success');
          } else {
            expect(prResult.result.data).toBe(true);
          }
        }),
      )
      .on(
        'submit',
        withStep((step, trDesc) => {
          expect(step).toBe(3);
          expect(trDesc.networkId).toBe(NetworkIds.development);
          expect(trDesc.chainId).toBe(chainId);
          expect(trDesc.requestKey).toBeTruthy();
        }),
      )
      .on(
        'listen',
        withStep((step, sbResult) => {
          expect(step).toBe(4);
          if (sbResult.result.status === 'failure') {
            expect(sbResult.result.status).toBe('success');
          } else {
            expect(sbResult.result.data).toBe(true);
          }
        }),
      )
      .execute();

    expect(result).toBe(true);
  });
});

describe('mintToken', () => {
  it('shoud mint a token', async () => {
    const withStep = withStepFactory();

    const result = await mintToken(
      {
        ...inputs,
        tokenId: tokenId as string,
        creatorAccount: sourceAccount.account,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
      },
      config,
    )
      .on(
        'sign',
        withStep((step, tx) => {
          expect(step).toBe(1);
          expect(tx.sigs).toHaveLength(1);
          expect(tx.sigs[0].sig).toBeTruthy();
        }),
      )
      .on(
        'preflight',
        withStep((step, prResult) => {
          expect(step).toBe(2);
          if (prResult.result.status === 'failure') {
            expect(prResult.result.status).toBe('success');
          } else {
            expect(prResult.result.data).toBe(true);
          }
        }),
      )
      .on(
        'submit',
        withStep((step, trDesc) => {
          expect(step).toBe(3);
          expect(trDesc.networkId).toBe(NetworkIds.development);
          expect(trDesc.chainId).toBe(chainId);
          expect(trDesc.requestKey).toBeTruthy();
        }),
      )
      .on(
        'listen',
        withStep((step, sbResult) => {
          expect(step).toBe(4);
          if (sbResult.result.status === 'failure') {
            expect(sbResult.result.status).toBe('success');
          } else {
            expect(sbResult.result.data).toBe(true);
          }
        }),
      )
      .execute();

    expect(result).toBe(true);

    const balance = await getTokenBalance(
      {
        accountName: sourceAccount.account,
        chainId,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(balance).toBe(1);
  });
  it('shoud throw error when non-existent token is minted', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = mintToken(
      {
        ...inputs,
        tokenId: nonExistingTokenId,
        creatorAccount: sourceAccount.account,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error('with-read: row not found: non-existing-token'),
    );
  });
});

describe('getTokenBalance', () => {
  it('shoud get a balance', async () => {
    const result = await getTokenBalance(
      {
        accountName: sourceAccount.account,
        chainId,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(result).toBeGreaterThan(0);
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = getTokenBalance(
      {
        accountName: sourceAccount.account,
        chainId,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        tokenId: nonExistingTokenId,
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error(
        `read: row not found: ${nonExistingTokenId}:${sourceAccount.account}`,
      ),
    );
  });
});

describe('transferCreateToken', () => {
  it('shoud transfer-create a token', async () => {
    const withStep = withStepFactory();

    const result = await transferCreateToken(
      {
        ...inputs,
        tokenId: tokenId as string,
        sender: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        receiver: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
      },
      config,
    )
      .on(
        'sign',
        withStep((step, tx) => {
          expect(step).toBe(1);
          expect(tx.sigs).toHaveLength(1);
          expect(tx.sigs[0].sig).toBeTruthy();
        }),
      )
      .on(
        'preflight',
        withStep((step, prResult) => {
          expect(step).toBe(2);
          if (prResult.result.status === 'failure') {
            expect(prResult.result.status).toBe('success');
          } else {
            expect(prResult.result.data).toBe(true);
          }
        }),
      )
      .on(
        'submit',
        withStep((step, trDesc) => {
          expect(step).toBe(3);
          expect(trDesc.networkId).toBe(NetworkIds.development);
          expect(trDesc.chainId).toBe(chainId);
          expect(trDesc.requestKey).toBeTruthy();
        }),
      )
      .on(
        'listen',
        withStep((step, sbResult) => {
          expect(step).toBe(4);
          if (sbResult.result.status === 'failure') {
            expect(sbResult.result.status).toBe('success');
          } else {
            expect(sbResult.result.data).toBe(true);
          }
        }),
      )
      .execute();

    expect(result).toBe(true);

    const balance = await getTokenBalance(
      {
        accountName: secondaryTargetAccount.account,
        chainId: chainId,
        guard: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        tokenId: tokenId as string,
      },
      { ...config, sign: createSignWithKeypair([secondaryTargetAccount]) },
    ).execute();

    expect(balance).toBe(1);
  });
  it('should throw an error if source account does not contain token', async () => {
    const task = transferCreateToken(
      {
        ...inputs,
        tokenId: tokenId as string,
        sender: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        receiver: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(100).toPactDecimal(),
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error('Insufficient funds'),
    );
  });
});
