import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { transferFund } from '../transferFund.js';
import { devNetConfigMock } from './mocks.js';

describe('transferFund', () => {
  beforeEach(() => {
    server.resetHandlers();
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
        'Failed to transfer fund : "Cannot transfer fund on mainnet with network ID: "mainnet01""',
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
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json(
            {
              result: {
                status: 'failure',
                error: {
                  message: 'shit hit the fan',
                },
              },
            },
            { status: 200 },
          );
        },
      ),
    );

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
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/development/chain/1/pact/api/v1/send',
        () => {
          return new HttpResponse('Something went wrong', { status: 500 });
        },
      ),
    );

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
