import type { ChainId } from '@kadena/types';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { walletSdk } from '../walletSdk.js';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setupServerResponse(
  url: string,
  responseType: 'json' | 'networkError' | 'text',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData?: any,
) {
  server.use(
    http.post(url, (req) => {
      if (responseType === 'json') {
        return HttpResponse.json(responseData, { status: 200 });
      } else if (responseType === 'text') {
        const body =
          typeof responseData === 'string' ? responseData : 'Invalid response';
        return HttpResponse.text(body, { status: 200 });
      } else if (responseType === 'networkError') {
        throw new Error('Network Error');
      }
      return undefined;
    }),
  );
}

/**
 * Helper function to construct the local URL for the Pact API.
 */
function getLocalUrl(networkId: string, chainId: string): string {
  const host = walletSdk.getChainwebUrl({ networkId, chainId });

  return `${host}/api/v1/local`;
}

describe('WalletSDK - getAccountDetails', () => {
  const accountName = 'test-account';
  const networkId = 'testnet04';
  const fungible = 'coin';
  const chainIds: ChainId[] = ['0', '1'];

  it('should return account details for multiple chains', async () => {
    chainIds.forEach((chainId) => {
      const url = getLocalUrl(networkId, chainId);

      const responseData = {
        gas: 0,
        result: {
          status: 'success',
          data: {
            account: accountName,
            balance: 1000,
            guard: {
              pred: 'keys-all',
              keys: ['key1', 'key2'],
            },
          },
        },
        reqKey: 'some-request-key',
        logs: 'some-logs',
        metaData: null,
      };

      setupServerResponse(url, 'json', responseData);
    });

    const result = await walletSdk.getAccountDetails(
      accountName,
      networkId,
      fungible,
      chainIds,
    );

    expect(result).toEqual([
      {
        chainId: '0',
        accountDetails: {
          account: accountName,
          balance: 1000,
          guard: {
            pred: 'keys-all',
            keys: ['key1', 'key2'],
          },
        },
      },
      {
        chainId: '1',
        accountDetails: {
          account: accountName,
          balance: 1000,
          guard: {
            pred: 'keys-all',
            keys: ['key1', 'key2'],
          },
        },
      },
    ]);
  });

  it('should return null accountDetails for chains where account does not exist', async () => {
    chainIds.forEach((chainId) => {
      const url = getLocalUrl(networkId, chainId);

      const responseData = {
        gas: 0,
        result: {
          status: 'failure',
          error: {
            callStack: [],
            type: 'TxFailure',
            message: `with-read: row not found: ${accountName}`,
            info: '',
          },
        },
        reqKey: 'some-request-key',
        logs: 'some-logs',
        metaData: null,
      };

      setupServerResponse(url, 'json', responseData);
    });

    const result = await walletSdk.getAccountDetails(
      accountName,
      networkId,
      fungible,
      chainIds,
    );

    expect(result).toEqual([
      {
        chainId: '0',
        accountDetails: null,
      },
      {
        chainId: '1',
        accountDetails: null,
      },
    ]);
  });

  it('should handle network errors gracefully', async () => {
    chainIds.forEach((chainId) => {
      const url = getLocalUrl(networkId, chainId);

      setupServerResponse(url, 'networkError');
    });

    const result = await walletSdk.getAccountDetails(
      accountName,
      networkId,
      fungible,
      chainIds,
    );

    expect(result).toEqual([]);
  });

  it('should handle partial failures', async () => {
    // First chain returns success
    const urlSuccess = getLocalUrl(networkId, '0');

    const responseDataSuccess = {
      gas: 0,
      result: {
        status: 'success',
        data: {
          account: accountName,
          balance: 1000,
          guard: {
            pred: 'keys-all',
            keys: ['key1', 'key2'],
          },
        },
      },
      reqKey: 'some-request-key',
      logs: 'some-logs',
      metaData: null,
    };

    setupServerResponse(urlSuccess, 'json', responseDataSuccess);

    // second chain returns error
    const urlFail = getLocalUrl(networkId, '1');

    const responseDataFailure = {
      gas: 0,
      result: {
        status: 'failure',
        error: {
          callStack: [],
          type: 'TxFailure',
          message: `with-read: row not found: ${accountName}`,
          info: '',
        },
      },
      reqKey: 'some-request-key',
      logs: 'some-logs',
      metaData: null,
    };

    setupServerResponse(urlFail, 'json', responseDataFailure);

    const result = await walletSdk.getAccountDetails(
      accountName,
      networkId,
      fungible,
      chainIds,
    );

    expect(result).toEqual([
      {
        chainId: '0',
        accountDetails: {
          account: accountName,
          balance: 1000,
          guard: {
            pred: 'keys-all',
            keys: ['key1', 'key2'],
          },
        },
      },
      {
        chainId: '1',
        accountDetails: null,
      },
    ]);
  });
});
