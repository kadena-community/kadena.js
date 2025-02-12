import type { ChainId, PactErrorCode } from '@kadena/client';
import { createSignWithKeypair, getPactErrorCode } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { IPactInt } from '@kadena/types';
import { describe, expect, it } from 'vitest';
import {
  buyToken,
  createAuction,
  createToken,
  createTokenId,
  getAuctionDetails,
  getCurrentPrice,
  getEscrowAccount,
  getTokenBalance,
  mintToken,
  offerToken,
  updateAuction,
} from '../marmalade';
import { NetworkIds } from './support/NetworkIds';
import {
  addDaysToDate,
  addSecondsToDate,
  dateToPactInt,
  getBlockDate,
  waitForBlockTime,
  withStepFactory,
} from './support/helpers';
import { secondaryTargetAccount, sourceAccount } from './test-data/accounts';

let tokenId: string | undefined;
let saleId: string | undefined;

const timeout = dateToPactInt(addDaysToDate(new Date(), 1));
const PRICE_INTERVAL_IN_SECONDS: IPactInt = { int: '5' };

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

const config = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
  },
  sign: createSignWithKeypair([sourceAccount]),
};

describe('create, mint and offer a token with auction, update auction. Get details', () => {
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
      chainId,
      tokenId: tokenId as string,
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
          saleType: 'marmalade-sale.dutch-auction',
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

  it('is able to create dutch auction', async () => {
    const withStep = withStepFactory();

    const blockDate = await getBlockDate({ chainId });
    auctionStartDate = dateToPactInt(addSecondsToDate(blockDate, 10));
    auctionEndDate = dateToPactInt(addSecondsToDate(blockDate, 30));

    const result = await createAuction(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: auctionStartDate,
        endDate: auctionEndDate,
        startPrice: { decimal: '100.0' },
        reservedPrice: { decimal: '1.0' },
        priceIntervalInSeconds: PRICE_INTERVAL_IN_SECONDS,
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

  it('is able to update dutch auction', async () => {
    if (auctionStartDate === undefined || auctionEndDate === undefined) {
      throw new Error('auctionStartDate or auctionEndDate is undefined');
    }

    const withStep = withStepFactory();

    // add 5 seconds to the auction start and end date
    auctionStartDate = dateToPactInt(
      addSecondsToDate(new Date(Number(auctionStartDate.int) * 1000), 5),
    );
    auctionEndDate = dateToPactInt(
      addSecondsToDate(new Date(Number(auctionEndDate.int) * 1000), 5),
    );

    const result = await updateAuction(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: auctionStartDate,
        endDate: auctionEndDate,
        startPrice: { decimal: '10.0' },
        reservedPrice: { decimal: '1.0' },
        priceIntervalInSeconds: PRICE_INTERVAL_IN_SECONDS,
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
        dutch: true,
      },
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(result).toStrictEqual(
      expect.objectContaining({
        buyer: '',
        'price-interval-seconds': {
          int: Number(PRICE_INTERVAL_IN_SECONDS.int),
        },
        'reserve-price': 1,
        'sell-price': 0,
        'start-price': 10,
      }),
    );
  });

  it('returns 0 if the auction has not started yet', async () => {
    const result = await getCurrentPrice({
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(result).toBe(0);
  });

  it(
    'returns start price after the auction have started',
    async () => {
      if (auctionStartDate === undefined) {
        throw new Error('auctionStartDate is undefined');
      }
      const blockDate = await getBlockDate({ chainId });
      console.log(
        `blockDate:        ${new Date(blockDate)}
auctionStartDate:  ${new Date(Number(auctionStartDate.int) * 1000)}`,
      );
      await waitForBlockTime(auctionStartDate);

      const result = await getCurrentPrice({
        saleId: saleId as string,
        chainId,
        networkId: config.defaults.networkId,
        host: config.host,
      });

      expect(result).toBe(10);
    },
    { timeout: 60000 },
  );
});

describe('buyToken', () => {
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

  let auctionStartDate: IPactInt | undefined;
  let auctionEndDate: IPactInt | undefined;

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
    const result = await createToken(
      { ...inputs, tokenId: tokenId as string },
      config,
    ).execute();

    expect(result).toBe(true);
  });

  it('mints a token', async () => {
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
    ).execute();

    expect(result).toBe(true);
  });

  it('offers a token for sale', async () => {
    const withStep = withStepFactory();

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
          saleType: 'marmalade-sale.dutch-auction',
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

  it('creates dutch auction', async () => {
    const blockDate = await getBlockDate({ chainId });
    auctionStartDate = dateToPactInt(addSecondsToDate(blockDate, 10));
    auctionEndDate = dateToPactInt(addSecondsToDate(blockDate, 20));

    const result = await createAuction(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: auctionStartDate,
        endDate: auctionEndDate,
        startPrice: { decimal: '5.0' },
        reservedPrice: { decimal: '1.0' },
        priceIntervalInSeconds: PRICE_INTERVAL_IN_SECONDS,
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

  it('buys a token', async () => {
    if (auctionStartDate === undefined) {
      throw new Error('auctionStartDate is undefined');
    }
    await waitForBlockTime(auctionStartDate);

    const withStep = withStepFactory();

    const config = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    const escrowAccount = await getEscrowAccount({
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(escrowAccount).toBeDefined();

    const latestPrice = await getCurrentPrice({
      saleId: saleId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(latestPrice).toBeDefined();
    
    const result = await buyToken(
      {
        auctionConfig: {
          dutch: true,
        },
        updatedPrice: { decimal: String(latestPrice) },
        escrow: {
          account: (escrowAccount as any).account,
        },
        chainId,
        tokenId: tokenId as string,
        saleId: saleId as string,
        seller: {
          account: sourceAccount.account,
        },
        buyerFungibleAccount: secondaryTargetAccount.account,
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
              `Error: ${JSON.stringify(prResult.result.error, null, 2)}`,
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
            expect(
              sbResult.result.status,
              `Error:${JSON.stringify(sbResult.result.error, null, 2)}`,
            ).toBe('success');
          } else {
            expect(sbResult.result.data).toBe(saleId);
          }
        }),
      )
      .execute();

    expect(result).toBe(saleId);

    const balance = await getTokenBalance({
      accountName: secondaryTargetAccount.account,
      tokenId: tokenId as string,
      chainId,
      networkId: config.defaults.networkId,
      host: config.host,
    });

    expect(balance).toBe(1);
  });
});

describe('non-existent auction details', () => {
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
        timeout,
      },
      saleConfig,
    );

    const res = await task.execute().catch((err) => getPactErrorCode(err));
    expect(res).toBe('RECORD_NOT_FOUND' as PactErrorCode);
  });
});
