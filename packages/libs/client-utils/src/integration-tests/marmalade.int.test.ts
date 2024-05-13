import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { describe, expect, it } from 'vitest';
import {
  burnToken,
  createToken,
  createTokenId,
  getAccountDetails,
  getTokenBalance,
  getTokenInfo,
  getUri,
  mintToken,
  transferCreateToken,
  updateUri,
} from '../marmalade';
import { NetworkIds } from './support/NetworkIds';
import { withStepFactory } from './support/helpers';
import { secondaryTargetAccount, sourceAccount } from './test-data/accounts';

let tokenId: string | undefined;
const chainId = '0' as ChainId;
const inputs = {
  chainId,
  precision: { int: '0' },
  uri: Math.random().toString(),
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

describe('createTokenId', () => {
  it('should return a token id', async () => {
    tokenId = await createTokenId(inputs, config).execute();

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);
  });
});

describe('createToken', () => {
  it('should create a token', async () => {
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

  it('should create a token with policy', async () => {
    const withStep = withStepFactory();

    const _inputs = {
      ...inputs,
      policies: ['marmalade-v2.guard-policy-v1'],
    };

    const tokenId = await createTokenId(_inputs, config).execute();

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);

    const result = await createToken(
      {
        ..._inputs,
        policyConfig: {
          guarded: true,
          updatableURI: true,
        },
        guards: {},
        tokenId: tokenId as string,
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
  });
});

describe('mintToken', () => {
  it('should mint a token', async () => {
    const withStep = withStepFactory();

    const result = await mintToken(
      {
        ...inputs,
        tokenId: tokenId as string,
        accountName: sourceAccount.account,
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
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(balance).toBe(1);
  });
  it('should throw error when non-existent token is minted', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = mintToken(
      {
        ...inputs,
        tokenId: nonExistingTokenId,
        accountName: sourceAccount.account,
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
  it('should get a balance', async () => {
    const result = await getTokenBalance(
      {
        accountName: sourceAccount.account,
        chainId,
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

describe('getAccountDetails', () => {
  it('should get the account details', async () => {
    const result = await getAccountDetails(
      {
        chainId,
        accountName: sourceAccount.account,
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(result).toStrictEqual({
      account: sourceAccount.account,
      balance: 1,
      guard: {
        keys: [sourceAccount.publicKey],
        pred: 'keys-all' as const,
      },
      id: tokenId,
    });
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = getAccountDetails(
      {
        chainId,
        accountName: sourceAccount.account,
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

describe('getTokenInfo', () => {
  it('should get the info', async () => {
    const result = await getTokenInfo(
      {
        chainId,
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(result).toStrictEqual({
      supply: 1,
      precision: { int: 0 },
      uri: inputs.uri,
      id: tokenId,
      policies: [],
    });
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = getTokenInfo(
      {
        chainId,
        tokenId: nonExistingTokenId,
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error(`with-read: row not found: ${nonExistingTokenId}`),
    );
  });
});

describe('getTokenUri', () => {
  it('should get the uri', async () => {
    const result = await getUri(
      {
        chainId,
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(result).toBe(inputs.uri);
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = getUri(
      {
        chainId,
        tokenId: nonExistingTokenId,
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error(`with-read: row not found: ${nonExistingTokenId}`),
    );
  });
});

describe('updateUri', () => {
  it('should update the uri', async () => {
    const result = await updateUri(
      {
        tokenId: tokenId as string,
        uri: 'ipfs://updated-uri',
        chainId,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
      },
      config,
    ).execute();

    expect(result).toBe(true);
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = updateUri(
      {
        tokenId: nonExistingTokenId,
        uri: 'ipfs://updated-uri',
        chainId,
        guard: {
          account: sourceAccount.account,
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error(`with-read: row not found: ${nonExistingTokenId}`),
    );
  });
});

describe('transferCreateToken', () => {
  it('should transfer-create a token', async () => {
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

describe('burnToken', () => {
  it('should burn a token', async () => {
    const withStep = withStepFactory();

    const burnConfig = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    const result = await burnToken(
      {
        ...inputs,
        tokenId: tokenId as string,
        accountName: secondaryTargetAccount.account,
        guard: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
      },
      burnConfig,
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
        chainId,
        tokenId: tokenId as string,
      },
      burnConfig,
    ).execute();

    expect(balance).toBe(0);
  });
  it('should throw error when non-existent token is burned', async () => {
    const burnConfig = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    const nonExistingTokenId = 'non-existing-token';
    const task = burnToken(
      {
        ...inputs,
        tokenId: nonExistingTokenId,
        accountName: secondaryTargetAccount.account,
        guard: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
      },
      burnConfig,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error('with-read: row not found: non-existing-token'),
    );
  });
});
