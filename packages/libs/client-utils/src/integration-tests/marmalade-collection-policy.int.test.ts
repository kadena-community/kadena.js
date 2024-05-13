import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { IPactInt } from '@kadena/types';
import { describe, expect, it } from 'vitest';
import {
  createCollection,
  createCollectionId,
  createToken,
  createTokenId,
  getCollection,
  getCollectionToken,
  getTokenBalance,
  mintToken,
} from '../marmalade';
import type { ICreateTokenPolicyConfig } from '../marmalade/config';
import { NetworkIds } from './support/NetworkIds';
import { withStepFactory } from './support/helpers';
import { sourceAccount } from './test-data/accounts';

let tokenId: string | undefined;
let collectionId: string | undefined;
let collectionName: string | undefined;
const collectionSize: IPactInt = { int: '0' };
const chainId = '0' as ChainId;

const inputs = {
  policyConfig: {
    collection: true,
  } as ICreateTokenPolicyConfig,
  collection: {
    collectionId,
  },
  chainId,
  precision: { int: '0' },
  uri: Math.random().toString(),
  policies: ['marmalade-v2.collection-policy-v1'],
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

describe('createCollectionId', () => {
  it('should return a collection id', async () => {
    collectionName = `Test Collection #${Math.random().toString()}`;

    collectionId = await createCollectionId(
      {
        collectionName,
        chainId,
        operator: {
          keyset: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
      },
      config,
    ).execute();

    expect(collectionId).toBeDefined();
    expect(collectionId).toMatch(/^collection:.{43}$/);

    inputs.collection.collectionId = collectionId;
  });
});

describe('createCollection', () => {
  it('should create a collection', async () => {
    const withStep = withStepFactory();

    const result = await createCollection(
      {
        id: collectionId as string,
        name: collectionName as string,
        size: collectionSize,
        operator: inputs.creator,
        chainId,
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

describe('createTokenId', () => {
  it('should return a token id', async () => {
    tokenId = await createTokenId(inputs, config).execute();

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);
  });
});

describe('createToken', () => {
  it('should create a token with policy', async () => {
    const withStep = withStepFactory();

    const tokenId = await createTokenId(inputs, config).execute();

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);

    const result = await createToken(
      {
        ...inputs,
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

describe('getCollection', () => {
  it('should get the collection details', async () => {
    const result = await getCollection(
      {
        chainId,
        collectionId: collectionId as string,
      },
      config,
    ).execute();

    expect(result).toStrictEqual({
      id: collectionId,
      'max-size': {
        int: Number(collectionSize.int),
      },
      name: collectionName,
      'operator-guard': inputs.creator.keyset,
      size: {
        int: 1,
      },
    });
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-collection';
    const task = getCollection(
      {
        chainId,
        collectionId: nonExistingTokenId,
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error(`read: row not found: non-existing-collection`),
    );
  });
});

describe('getCollectionToken', () => {
  it('should get the collection token details', async () => {
    const result = await getCollectionToken(
      {
        chainId,
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(result).toStrictEqual({
      id: tokenId,
      'collection-id': collectionId,
    });
  });
  it('should throw an error if token does not exist', async () => {
    const nonExistingTokenId = 'non-existing-token';
    const task = getCollectionToken(
      {
        chainId,
        tokenId: nonExistingTokenId,
      },
      config,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error(`read: row not found: non-existing-token`),
    );
  });
});
