import { createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId, IPactInt } from '@kadena/types';
import { describe, expect, it } from 'vitest';
import {
  buyToken,
  createAuction,
  createToken,
  createTokenId,
  escrowAccount,
  getEscrowAccount,
  getTokenBalance,
  mintToken,
  offerToken,
  placeBid,
} from '../marmalade';
import {
  addSecondsToDate,
  dateToPactInt,
  getBlockDate,
  waitForBlockTime,
  withStepFactory,
} from './support/helpers';
import { NetworkIds } from './support/NetworkIds';
import { secondaryTargetAccount, sourceAccount } from './test-data/accounts';

describe('create id, mint, offer for sale, create conventional auction, for a token and places a bid and buy the token', () => {
  const config = {
    host: 'http://127.0.0.1:8080',
    defaults: {
      networkId: 'development',
    },
    sign: createSignWithKeypair([sourceAccount]),
  };

  let tokenId: string | undefined;
  let saleId: string | undefined;
  const chainId = '0' as ChainId;

  const inputs = {
    chainId,
    precision: { int: '0' },
    uri: Math.random().toString(),
    policies: [],
    creator: {
      account: sourceAccount.account,
      guard: {
        keys: [sourceAccount.publicKey],
        pred: 'keys-all' as const,
      },
    },
  };
  let auctionStartDate: IPactInt;
  let auctionEndDate: IPactInt;

  it('creates token id', async () => {
    tokenId = await createTokenId({
      ...inputs,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);
  });

  it('creates a token', async () => {
    if (tokenId === undefined) {
      throw new Error('Token ID is not defined');
    }

    const result = await createToken(
      { ...inputs, tokenId: tokenId },
      config,
    ).execute();

    expect(result).toBe(true);
  });

  it('mints a token', async () => {
    if (tokenId === undefined) {
      throw new Error('Token ID is not defined');
    }

    const result = await mintToken(
      {
        ...inputs,
        tokenId: tokenId,
        accountName: sourceAccount.account,
        guard: {
          account: sourceAccount.account,
          guard: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
      },
      config,
    ).execute();

    expect(result).toBe(true);
  });

  it('offers a token for sale', async () => {
    if (tokenId === undefined) {
      throw new Error('Token ID is not defined');
    }
    const withStep = withStepFactory();
    const blockTime = await getBlockDate({ chainId: chainId as ChainId });

    const result = await offerToken(
      {
        policyConfig: {
          auction: true,
        },
        auction: {
          fungible: {
            refName: {
              name: 'coin',
              namespace: null,
            },
            refSpec: [
              {
                name: 'fungible-v2',
                namespace: null,
              },
            ],
          },
          sellerFungibleAccount: {
            account: sourceAccount.account,
            guard: {
              keys: [sourceAccount.publicKey],
              pred: 'keys-all' as const,
            },
          },
          price: { decimal: '0.0' },
          saleType: 'marmalade-sale.conventional-auction',
        },
        chainId,
        tokenId: tokenId,
        seller: {
          account: sourceAccount.account,
          guard: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
        timeout: dateToPactInt(addSecondsToDate(new Date(blockTime), 3)),
      },
      config,
    )
      .on(
        'sign',
        withStep((step, tx) => {
          saleId = tx.hash;
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
            expect(prResult.result.data).toBe(saleId);
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
            expect(sbResult.result.data).toBe(saleId);
          }
        }),
      )
      .execute();

    expect(result).toBe(saleId);
  });

  it('creates conventional auction', async () => {
    const blockTime = await getBlockDate({ chainId: chainId as ChainId });
    auctionStartDate = dateToPactInt(addSecondsToDate(new Date(blockTime), 3));
    auctionEndDate = dateToPactInt(addSecondsToDate(new Date(blockTime), 13));

    if (tokenId === undefined || saleId === undefined) {
      throw new Error('Token ID or Sale ID is not defined');
    }

    const result = await createAuction(
      {
        auctionConfig: {
          conventional: true,
        },
        saleId: saleId,
        tokenId: tokenId,
        startDate: auctionStartDate,
        endDate: auctionEndDate,
        reservedPrice: { decimal: '1.0' },
        chainId,
        seller: {
          account: sourceAccount.account,
          guard: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
      },
      config,
    ).execute();

    expect(result).toBe(true);
  });

  it('is able to place a bid on conventional auction', async () => {
    await waitForBlockTime(auctionStartDate);

    const withStep = withStepFactory();

    const config = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    if (saleId === undefined) {
      throw new Error('Sale ID is not defined');
    }

    const _escrowAccount = await escrowAccount({
      saleId: saleId,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    const result = await placeBid(
      {
        bid: { decimal: '2.0' },
        bidder: {
          account: secondaryTargetAccount.account,
          guard: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        escrowAccount: _escrowAccount,
        saleId: saleId,
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
          sbResult.events?.find((event) => event.name === 'BID_PLACED');

          expect(step).toBe(4);
          if (sbResult.result.status === 'failure') {
            expect(sbResult.result.status).toBe('success');
          } else {
            expect(sbResult.result.data).toBe(true);
          }
        }),
      )
      .execute()
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2));
        return false;
      });

    expect(result).toBe(true);
  });

  it('buys a token', async () => {
    await waitForBlockTime(auctionEndDate);

    const withStep = withStepFactory();

    const config = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    if (saleId === undefined) {
      throw new Error('Sale ID is not defined');
    }

    const policyManager_escrowAccount = await getEscrowAccount({
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(policyManager_escrowAccount).toBeDefined();

    const _escrowAccount = await escrowAccount({
      saleId: saleId,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });
    
    expect(_escrowAccount).toBeDefined();

    if (_escrowAccount === undefined || tokenId === undefined) {
      throw new Error('Escrow account, or token ID is not defined');
    }

    const result = await buyToken(
      {
        auctionConfig: {
          conventional: true,
        },
        escrow: { account: (policyManager_escrowAccount as any).account },
        updatedPrice: { decimal: '2.0' },
        chainId,
        tokenId: tokenId,
        saleId: saleId,
        seller: {
          account: sourceAccount.account,
        },
        buyerFungibleAccount: _escrowAccount,
        sellerFungibleAccount: sourceAccount.account,
        signerPublicKey: secondaryTargetAccount.publicKey,
        buyer: {
          account: secondaryTargetAccount.account,
          guard: {
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
            expect(
              prResult.result.status,
              `Error: ${JSON.stringify(prResult.result.error)}`,
            ).toBe('success');
          } else {
            expect(prResult.result.data).toBe(saleId);
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
            expect(sbResult.result.data).toBe(saleId);
          }
        }),
      )
      .execute();

    expect(result).toBe(saleId);

    const balance = await getTokenBalance({
      accountName: secondaryTargetAccount.account,
      tokenId: tokenId,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(balance).toBe(1);
  });
});
