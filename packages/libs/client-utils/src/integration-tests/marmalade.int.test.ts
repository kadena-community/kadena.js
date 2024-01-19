import { ChainId, createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { beforeAll, describe, expect, it } from 'vitest';
import { transferCreate } from '../coin';
import { createToken } from '../marmalade/create-token';
import { createTokenId } from '../marmalade/create-token-id';
import { mintToken } from '../marmalade/mint-token';
import { NetworkIds } from './support/NetworkIds';
import { withStepFactory } from './support/helpers';
import { sender00Account, sourceAccount } from './test-data/accounts';

let tokenId: string | undefined;
let inputs = {
  chainId: '0' as ChainId,
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
let config = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'fast-development',
  },
  sign: createSignWithKeypair([sourceAccount]),
};

beforeAll(async () => {
  const result = await transferCreate(
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
      chainId: '0',
    },
    {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'fast-development',
      },
      sign: createSignWithKeypair([sender00Account]),
    },
  ).execute();

  expect(result).toBe('Write succeeded');
});

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
          expect(trDesc.networkId).toBe(NetworkIds.fast_development);
          expect(trDesc.chainId).toBe('0');
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
          expect(trDesc.networkId).toBe(NetworkIds.fast_development);
          expect(trDesc.chainId).toBe('0');
          expect(trDesc.requestKey).toBeTruthy();
        }),
      )
      .on(
        'listen',
        withStep((step, sbResult) => {
          console.log(sbResult);
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
