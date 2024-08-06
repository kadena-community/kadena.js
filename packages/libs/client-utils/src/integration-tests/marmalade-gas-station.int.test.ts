import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { beforeAll, describe, expect, it } from 'vitest';
import { describeModule } from '../built-in';
import { getBalance, transfer } from '../coin';
import type { IClientConfig } from '../core/utils/helpers';
import {
  createToken,
  createTokenId,
  getTokenBalance,
  mintToken,
} from '../marmalade';
import { NetworkIds } from './support/NetworkIds';
import { deployGasStation, withStepFactory } from './support/helpers';
import { sender00Account, sourceAccount } from './test-data/accounts';

let tokenId: string | undefined;
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

beforeAll(async () => {
  const config: IClientConfig = {
    host: 'http://127.0.0.1:8080',
    defaults: {
      networkId: 'development',
      meta: {
        chainId,
      },
    },
    sign: createSignWithKeypair([sender00Account]),
  };

  let gasStationDeployed = false;
  try {
    await describeModule('free.test-gas-station', config);
    gasStationDeployed = true;
  } catch (error) {
    console.log('Gas station not deployed, deploying now');
  }

  if (!gasStationDeployed) {
    await deployGasStation({
      chainId,
    });
  }

  const gasStationFunds = await getBalance(
    'test-gas-station',
    config.defaults?.networkId as string,
    chainId,
    config.host,
  );

  if (gasStationFunds === '0') {
    console.log('Gas station has no funds, topping up now');
    await transfer(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: 'test-gas-station',
        amount: '100',
        chainId,
      },
      config,
    ).execute();
  }
}, 300000);

describe('createTokenId', () => {
  it('should return a token id', async () => {
    tokenId = await createTokenId({
      ...inputs,
      networkId: config.defaults.networkId,
      host: config.host,
    });

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
  it('should mint a token using a gas station to sponsor the gas fee', async () => {
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
        meta: {
          senderAccount: 'test-gas-station',
        },
        capabilities: [
          {
            name: 'free.test-gas-station.GAS_PAYER',
            props: [sourceAccount.account, { int: 0 }, { decimal: '0.0' }],
          },
        ],
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

          const transferEvent = prResult.events!.find(
            (event) => event.name === 'TRANSFER',
          )!;

          // ensure that the gas station payed for the gas fee
          expect(transferEvent.params[0]).toBe('test-gas-station');
          expect(transferEvent.params[1]).toBe('NoMiner');
          expect(transferEvent.params[2]).toBe(
            prResult.gas * prResult.metaData!.publicMeta!.gasPrice,
          );
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
});
