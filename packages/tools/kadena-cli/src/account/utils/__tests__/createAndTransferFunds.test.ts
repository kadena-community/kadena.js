import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { createAndTransferFund } from '../createAndTransferFunds.js';
import { testNetworkConfigMock } from './mocks.js';

describe('createAndTransferFunds', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('should throw an error when trying to transfer fund on mainnet', async () => {
    await expect(async () => {
      await createAndTransferFund({
        account: {
          name: 'accountName',
          publicKeys: ['publicKey1'],
          predicate: 'predicate',
        },
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: {
            ...testNetworkConfigMock,
            networkId: 'mainnet01',
          },
        },
      });
    }).rejects.toEqual(
      Error(
        `Failed to create an account and transfer fund: Cannot transfer fund on mainnet`,
      ),
    );
  });

  it('should create and transfer funds', async () => {
    const result = await createAndTransferFund({
      account: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
      },
      config: {
        amount: '100',
        contract: 'coin',
        chainId: '1',
        networkConfig: testNetworkConfigMock,
      },
    });

    expect(result).toStrictEqual({
      chainId: '1',
      networkId: 'testnet04',
      requestKey: 'requestKey-1',
    });
  });

  it('should throw an error when any sort of error happens', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send',
        () => {
          return new HttpResponse('gas failure', { status: 500 });
        },
      ),
    );

    await expect(async () => {
      await createAndTransferFund({
        account: {
          name: 'accountName',
          publicKeys: ['publicKey'],
          predicate: 'predicate',
        },
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: testNetworkConfigMock,
        },
      });
    }).rejects.toEqual(
      Error(`Failed to create an account and transfer fund: gas failure`),
    );
  });
});
