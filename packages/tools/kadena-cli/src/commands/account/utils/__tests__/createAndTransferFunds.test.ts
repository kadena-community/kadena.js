import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MAINNET_FUND_TRANSFER_ERROR_MESSAGE } from '../../../../constants/account.js';
import { testNetworkConfigMock } from '../../../../mocks/network.js';
import { server, useMswHandler } from '../../../../mocks/server.js';
import { createAndTransferFund } from '../createAndTransferFunds.js';

describe('createAndTransferFunds', () => {
  beforeEach(() => {
    useMswHandler({
      network: testNetworkConfigMock,
      response: {
        result: {
          data: 'Write succeeded',
          status: 'success',
        },
      },
    });

    useMswHandler({
      network: testNetworkConfigMock,
      endpoint: 'send',
      response: {
        requestKeys: ['requestKey-1'],
      },
    });
  });

  afterEach(() => {
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
        `Failed to create an account and transfer fund: ${MAINNET_FUND_TRANSFER_ERROR_MESSAGE} "mainnet01"`,
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
    useMswHandler({
      network: testNetworkConfigMock,
      response: 'gas failure',
      status: 500,
      endpoint: 'send',
    });

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

  it('should throw an error when status is failure', async () => {
    useMswHandler({
      network: testNetworkConfigMock,
      response: {
        result: {
          error: {
            message: 'gas failure',
          },
          status: 'failure',
        },
      },
    });

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
