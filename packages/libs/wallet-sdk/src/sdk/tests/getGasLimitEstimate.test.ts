import type { ICommand } from '@kadena/types';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData: any,
  responseType: 'json' | 'error' = 'json',
) {
  server.use(
    http.post(url, (req) => {
      if (responseType === 'json' && responseData !== undefined) {
        return HttpResponse.json(responseData, { status: 200 });
      }
      return HttpResponse.json(
        { result: { error: 'Execution failed', status: 'error' } },
        { status: 400 },
      );
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

describe('WalletSDK - getGasLimitEstimate', () => {
  const networkId = 'testnet04';
  const chainId = '1';

  const url = getLocalUrl(networkId, chainId);

  const mockTransaction: ICommand = {
    cmd: JSON.stringify({
      networkId,
      payload: {
        exec: {
          data: { someKey: 'someValue' },
          code: '(+ 1 2)',
        },
      },
      meta: {
        chainId,
        gasLimit: 10000,
        gasPrice: 1e-8,
        ttl: 28800,
        creationTime: Math.floor(Date.now() / 1000),
        sender: 'sender',
      },
      signers: [{ pubKey: 'publicKey' }],
      nonce: 'test-nonce',
    }),
    hash: 'mock-hash',
    sigs: [{ sig: 'mock-sig' }],
  };

  it('should return the gas limit estimate', async () => {
    const gasLimit = 12000;

    setupServerResponse(url, {
      gas: gasLimit,
      result: { status: 'success', data: null },
    });

    const result = await walletSdk.getGasLimitEstimate(
      mockTransaction,
      networkId,
      chainId,
    );

    expect(result).toBe(gasLimit);
  });

  it('should throw an error when the network request fails', async () => {
    setupServerResponse(url, null, 'error');

    await expect(
      walletSdk.getGasLimitEstimate(mockTransaction, networkId, chainId),
    ).rejects.toThrow('Execution failed');
  });
});
