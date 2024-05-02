import type { ChainId } from '@kadena/client';
import { Pact, createSignWithKeypair } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { beforeAll, describe, expect, it } from 'vitest';
import { describeModule } from '../built-in';
import { transferCreate } from '../coin';
import { preflightClient, submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
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
import { deployMarmalade } from '../nodejs';
import { NetworkIds } from './support/NetworkIds';
import {
  addDaysToDate,
  addSecondsToDate,
  dateToPactInt,
  waitFor,
  withStepFactory,
} from './support/helpers';
import {
  secondaryTargetAccount,
  sender00Account,
  sourceAccount,
} from './test-data/accounts';

let tokenId: string | undefined;
let saleId: string | undefined;
let timeout = dateToPactInt(addDaysToDate(new Date(), 1));
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

  let saleWhitelisted = false;

  try {
    await preflightClient(config)(
      composePactCommand(
        execution(
          Pact.modules['marmalade-v2.policy-manager']['retrieve-sale'](
            'marmalade-sale.dutch-auction',
          ),
        ),
        addSigner([sourceAccount.publicKey], (signFor) => [
          signFor('coin.GAS'),
        ]),
        setMeta({ senderAccount: sourceAccount.account, chainId }),
      ),
    ).execute();

    saleWhitelisted = true;
  } catch (error) {
    console.log('Sale not whitelisted, whitelisting now');
  }

  if (!saleWhitelisted) {
    try {
      await submitClient({
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      })(
        composePactCommand(
          execution(
            Pact.modules['marmalade-v2.policy-manager']['add-sale-whitelist'](
              () => 'marmalade-sale.dutch-auction',
            ),
          ),
          addSigner([sender00Account.publicKey], (signFor) => [
            signFor('coin.GAS'),
            signFor(
              'marmalade-v2.policy-manager.SALE-WHITELIST',
              'marmalade-sale.dutch-auction',
            ),
          ]),
          setMeta({ senderAccount: sender00Account.account, chainId }),
        ),
      ).execute();

      saleWhitelisted = true;
    } catch (error) {
      console.log('Error whitelisting the sale');
      throw error;
    }
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
        guard: {
          account: sourceAccount.account,
        },
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(balance).toBe(1);
  });
});

describe('offerToken - with auction data', () => {
  it('should offer a token for sale', async () => {
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
            keyset: {
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
          keyset: {
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

  it('should throw error when non-existent token offered', async () => {
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
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
            pred: 'keys-all' as const,
          },
        },
        amount: new PactNumber(1).toPactDecimal(),
        timeout,
      },
      saleConfig,
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error('with-read: row not found: non-existing-token'),
    );
  });
});

describe('createAuction', () => {
  it('should be able to create dutch auction', async () => {
    const withStep = withStepFactory();

    const result = await createAuction(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: dateToPactInt(addSecondsToDate(new Date(), 50)),
        endDate: dateToPactInt(addSecondsToDate(new Date(), 100)),
        startPrice: { decimal: '100.0' },
        reservedPrice: { decimal: '1.0' },
        priceIntervalInSeconds: { int: '10' },
        chainId,
        seller: {
          account: sourceAccount.account,
          keyset: {
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
});

describe('updateAuction', () => {
  it('should be able to update dutch auction', async () => {
    const withStep = withStepFactory();

    const result = await updateAuction(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: dateToPactInt(addSecondsToDate(new Date(), 10)),
        endDate: dateToPactInt(addSecondsToDate(new Date(), 100)),
        startPrice: { decimal: '10.0' },
        reservedPrice: { decimal: '1.0' },
        priceIntervalInSeconds: { int: '10' },
        chainId,
        seller: {
          account: sourceAccount.account,
          keyset: {
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
            expect(prResult.result.data).toBe('Write succeeded');
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
            expect(sbResult.result.data).toBe('Write succeeded');
          }
        }),
      )
      .execute();

    expect(result).toBe('Write succeeded');
  });
});

describe('getAuctionDetails', () => {
  it('should get the auction details', async () => {
    const result = await getAuctionDetails(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        chainId,
        guard: {
          account: sourceAccount.account,
        },
      },
      config,
    ).execute();

    expect(result).toStrictEqual(
      expect.objectContaining({
        buyer: '',
        'price-interval-seconds': {
          int: 10,
        },
        'reserve-price': 1,
        'sell-price': 0,
        'start-price': 10,
      }),
    );
  });
});

describe('getCurrentPrice', () => {
  it('should return 0 if the auction has not started yet', async () => {
    const result = await getCurrentPrice(
      {
        saleId: saleId as string,
        chainId,
        guard: {
          account: sourceAccount.account,
        },
      },
      config,
    ).execute();

    expect(result).toBe(0);
  });

  it('should return start price after the auction have started', async () => {
    await waitFor(10000);

    const result = await getCurrentPrice(
      {
        saleId: saleId as string,
        chainId,
        guard: {
          account: sourceAccount.account,
        },
      },
      config,
    ).execute();

    expect(result).toBe(10);
  });
});

describe('buyToken', () => {
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

  it('should create token id', async () => {
    tokenId = await createTokenId(inputs, config).execute();

    expect(tokenId).toBeDefined();
    expect(tokenId).toMatch(/^t:.{43}$/);
  });

  it('should create a token', async () => {
    const result = await createToken(
      { ...inputs, tokenId: tokenId as string },
      config,
    ).execute();

    expect(result).toBe(true);
  });

  it('should mint a token', async () => {
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
    ).execute();

    expect(result).toBe(true);
  });

  it('should offer a token for sale', async () => {
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
            keyset: {
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
          keyset: {
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

  it('should create dutch auction', async () => {
    const result = await createAuction(
      {
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        tokenId: tokenId as string,
        startDate: dateToPactInt(addSecondsToDate(new Date(), 10)),
        endDate: dateToPactInt(addDaysToDate(new Date(), 10)),
        startPrice: { decimal: '5.0' },
        reservedPrice: { decimal: '1.0' },
        priceIntervalInSeconds: { int: '3600' },
        chainId,
        seller: {
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

  it('should buy a token', async () => {
    await waitFor(15000);

    const withStep = withStepFactory();

    const config = {
      host: 'http://127.0.0.1:8080',
      defaults: {
        networkId: 'development',
      },
      sign: createSignWithKeypair([secondaryTargetAccount]),
    };

    const escrowAccount = await getEscrowAccount(
      {
        saleId: saleId as string,
        chainId,
        guard: {
          account: secondaryTargetAccount.account,
        },
      },
      config,
    ).execute();

    expect(escrowAccount).toBeDefined();

    const latestPrice = await getCurrentPrice(
      {
        saleId: saleId as string,
        chainId,
        guard: {
          account: secondaryTargetAccount.account,
        },
      },
      config,
    ).execute();

    expect(latestPrice).toBeDefined();

    const result = await buyToken(
      {
        auctionConfig: {
          dutch: true,
        },
        updatedPrice: { decimal: String(latestPrice) },
        escrow: {
          account: (escrowAccount as any)['account'],
        },
        chainId,
        tokenId: tokenId as string,
        saleId: saleId as string,
        seller: {
          account: sourceAccount.account,
        },
        buyer: {
          account: secondaryTargetAccount.account,
          keyset: {
            keys: [secondaryTargetAccount.publicKey],
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

    const balance = await getTokenBalance(
      {
        accountName: secondaryTargetAccount.account,
        chainId,
        guard: {
          account: sourceAccount.account,
        },
        tokenId: tokenId as string,
      },
      config,
    ).execute();

    expect(balance).toBe(1);
  });
});
