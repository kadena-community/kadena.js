import type { ChainId, PactErrorCode } from '@kadena/client';
import { createSignWithKeypair, getPactErrorCode } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { IPactInt } from '@kadena/types';
import { describe, expect, it } from 'vitest';
import {
  createAuction,
  createBidId,
  createToken,
  createTokenId,
  escrowAccount,
  getAuctionDetails,
  getBid,
  getTokenBalance,
  mintToken,
  offerToken,
  placeBid,
  updateAuction,
} from '../marmalade';
import { NetworkIds } from './support/NetworkIds';
import {
  addDaysToDate,
  addMinutesToDate,
  addSecondsToDate,
  dateToPactInt,
  getBlockDate,
  waitForBlockTime,
  withStepFactory,
} from './support/helpers';
import { secondaryTargetAccount, sourceAccount } from './test-data/accounts';

const config = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
  },
  sign: createSignWithKeypair([sourceAccount]),
};

describe.only('creates, mints, offers for sale, creates and updates auction for, gets details of, bids on, a token', () => {
  let tokenId: string | undefined;
  let saleId: string | undefined;
  let bidId: string | undefined;
  let timeout: IPactInt | undefined;
  let auctionStartDate: IPactInt | undefined;
  let auctionEndDate: IPactInt | undefined;
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

  it('returns a token id', async () => {
    tokenId = await createTokenId({
      ...inputs,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);
  });

  it('creates a token', async () => {
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

  it('mints a token', async () => {
    const withStep = withStepFactory();

    const result = await mintToken(
      {
        ...inputs,
        tokenId: tokenId as string,
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

    const balance = await getTokenBalance({
      accountName: sourceAccount.account,
      tokenId: tokenId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(balance).toBe(1);
  });

  it('offers a token for sale', async () => {
    const withStep = withStepFactory();

    const saleConfig = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([sourceAccount]),
    };
    timeout = dateToPactInt(addDaysToDate(new Date(), 1));

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
        tokenId: tokenId as string,
        seller: {
          account: sourceAccount.account,
          guard: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
        timeout,
      },
      saleConfig,
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

  it('throws error when non-existent token offered', async () => {
    const saleConfig = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    const task = await offerToken(
      {
        chainId,
        tokenId: 'non-existing-token',
        seller: {
          account: secondaryTargetAccount.account,
          guard: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
        timeout: new PactNumber(
          Math.floor(addMinutesToDate(new Date(), 1).getTime() / 1000),
        ).toPactInteger(),
      },
      saleConfig,
    );

    const res = await task.execute().catch((err) => getPactErrorCode(err));
    expect(res).toBe('RECORD_NOT_FOUND' as PactErrorCode);
  });

  it('is able to create conventional auction', async () => {
    const withStep = withStepFactory();

    const result = await createAuction(
      {
        auctionConfig: {
          conventional: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: dateToPactInt(addSecondsToDate(new Date(), 50)),
        endDate: dateToPactInt(addMinutesToDate(new Date(), 60)),
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

  it('is able to update conventional auction', async () => {
    const withStep = withStepFactory();

    const currentBlockTime = await getBlockDate({ chainId });

    auctionStartDate = dateToPactInt(
      addSecondsToDate(new Date(currentBlockTime), 2),
    );
    auctionEndDate = dateToPactInt(
      addSecondsToDate(new Date(currentBlockTime), 8),
    );

    const result = await updateAuction(
      {
        auctionConfig: {
          conventional: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: auctionStartDate,
        endDate: auctionEndDate,
        reservedPrice: { decimal: '1.5' },
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

  it('gets the auction details', async () => {
    const result = await getAuctionDetails({
      auctionConfig: {
        conventional: true,
      },
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(result).toStrictEqual(
      expect.objectContaining({
        'token-id': tokenId,
        'reserve-price': 1.5,
        'highest-bid': 0,
        'highest-bid-id': '',
      }),
    );
  });

  it('is able to place a bid on conventional auction', async () => {
    if (!auctionStartDate) {
      throw new Error('auctionStartDate is not defined');
    }
    await waitForBlockTime(auctionStartDate);

    const withStep = withStepFactory();

    const _escrowAccount = await escrowAccount({
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    const result = await placeBid(
      {
        bid: { decimal: '2.0' },
        bidder: {
          account: sourceAccount.account,
          guard: {
            keys: [sourceAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        escrowAccount: _escrowAccount as string,
        saleId: saleId as string,
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
          const bidEvent = sbResult.events?.find(
            (event) => event.name === 'BID_PLACED',
          );

          bidId = bidEvent?.params[0] as string;

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

  it('returns a bid id', async () => {
    const bidId = await createBidId({
      saleId: saleId as string,
      bidderAccount: sourceAccount.account,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(bidId).toBeDefined();
  });

  it('gets the bid', async () => {
    const result = await getBid({
      bidId: bidId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(result).toStrictEqual({
      bid: 2,
      bidder: sourceAccount.account,
      'bidder-guard': {
        keys: [sourceAccount.publicKey],
        pred: 'keys-all',
      },
    });
  });
});
