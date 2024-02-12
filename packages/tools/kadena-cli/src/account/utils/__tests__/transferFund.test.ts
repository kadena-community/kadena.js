import { HttpResponse, http } from 'msw';
import { beforeEach } from 'node:test';
import { describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { transferFund } from '../transferFund.js';

describe('transferFund', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('should fund an account', async () => {
    const result = await transferFund({
      accountName: 'accountName',
      config: {
        amount: '100',
        contract: 'coin',
        chainId: '1',
        networkConfig: {
          networkId: 'fast-development',
          networkHost: 'http://localhost:8080',
          network: 'devnet',
          networkExplorerUrl: 'http://localhost:8080/explorer',
        },
      },
    });
    expect(result).toStrictEqual({
      result: {
        reqKey: 'requestKey-1',
        result: {
          status: 'success',
          data: 'Write succeeded',
        },
      },
    });
  });

  it('should throw an error when any sort of error happens', async () => {
    server.use(
      http.post(
        'http://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/send',
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
          networkConfig: {
            networkId: 'fast-development',
            networkHost: 'http://localhost:8080',
            network: 'devnet',
            networkExplorerUrl: 'http://localhost:8080/explorer',
          },
        },
      });
    }).rejects.toThrow('Something went wrong');
  });
});
