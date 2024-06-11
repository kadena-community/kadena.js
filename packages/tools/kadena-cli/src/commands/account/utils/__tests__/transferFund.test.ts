import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MAINNET_FUND_TRANSFER_ERROR_MESSAGE } from '../../../../constants/account.js';
import { devNetConfigMock } from '../../../../mocks/network.js';
import { server, useMswHandler } from '../../../../mocks/server.js';
import { transferFund } from '../transferFund.js';

describe('transferFund', () => {
  beforeEach(() => {
    useMswHandler({
      network: devNetConfigMock,
      response: {
        result: {
          data: 'Write succeeded',
          status: 'success',
        },
      },
    });
    useMswHandler({
      network: devNetConfigMock,
      endpoint: 'send',
      response: {
        requestKeys: ['requestKey-1', 'requestKey-2'],
      },
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should throw an error when trying to transfer fund on mainnet', async () => {
    await expect(async () => {
      await transferFund({
        accountName: 'accountName',
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: {
            ...devNetConfigMock,
            networkId: 'mainnet01',
          },
        },
      });
    }).rejects.toEqual(
      Error(
        `Failed to transfer fund : "${MAINNET_FUND_TRANSFER_ERROR_MESSAGE} "mainnet01""`,
      ),
    );
  });

  it('should fund an account', async () => {
    const result = await transferFund({
      accountName: 'accountName',
      config: {
        amount: '100',
        contract: 'coin',
        chainId: '1',
        networkConfig: devNetConfigMock,
      },
    });
    expect(result).toStrictEqual({
      chainId: '1',
      networkId: 'development',
      requestKey: 'requestKey-1',
    });
  });

  it('should throw an error when local api transaction failure', async () => {
    useMswHandler({
      network: devNetConfigMock,
      endpoint: 'local',
      response: {
        result: {
          status: 'failure',
          error: {
            message: 'shit hit the fan',
          },
        },
      },
    });

    await expect(async () => {
      await transferFund({
        accountName: 'accountName',
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: devNetConfigMock,
        },
      });
    }).rejects.toEqual(Error('Failed to transfer fund : "shit hit the fan"'));
  });

  it('should throw an error when any sort of error happens', async () => {
    useMswHandler({
      network: devNetConfigMock,
      endpoint: 'send',
      response: 'Something went wrong',
      status: 500,
    });

    await expect(async () => {
      await transferFund({
        accountName: 'accountName',
        config: {
          amount: '100',
          contract: 'coin',
          chainId: '1',
          networkConfig: devNetConfigMock,
        },
      });
    }).rejects.toEqual(
      Error('Failed to transfer fund : "Something went wrong"'),
    );
  });
});
