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
    http.get(url, (req) => {
      if (responseType === 'json') {
        return HttpResponse.json(responseData, { status: 200 });
      } else if (responseType === 'text') {
        const body =
          typeof responseData === 'string' ? responseData : 'Invalid response';
        return HttpResponse.text(body, { status: 200 });
      }
      return undefined;
    }),
  );
}

describe('WalletSDK - Info Functions', () => {
  const networkHost = 'https://api.testnet.chainweb.com';

  describe('getChains', () => {
    it('should return a list of chains when nodeChains is present', async () => {
      const mockResponse = {
        nodeChains: ['0', '1', '2', '3'],
        nodeVersion: '1.0',
      };

      setupServerResponse(`${networkHost}/info`, 'json', mockResponse);

      const result = await walletSdk.getChains(networkHost);

      expect(result).toEqual([
        { id: '0' },
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ]);
    });

    it('should return an empty array when nodeChains is missing', async () => {
      const mockResponse = {
        nodeVersion: '1.0',
      };

      setupServerResponse(`${networkHost}/info`, 'json', mockResponse);

      const result = await walletSdk.getChains(networkHost);

      expect(result).toEqual([]);
    });

    it('should return an empty array when nodeChains is null', async () => {
      const mockResponse = {
        nodeChains: null,
        nodeVersion: '1.0',
      };

      setupServerResponse(`${networkHost}/info`, 'json', mockResponse);

      const result = await walletSdk.getChains(networkHost);

      expect(result).toEqual([]);
    });
  });

  describe('getNetworkInfo', () => {
    it('should return network info excluding nodeChains when nodeChains is present', async () => {
      const mockResponse = {
        nodeApiVersion: '1.0',
        nodeBlockDelay: 10,
        nodeChains: ['0', '1', '2', '3'],
        nodeGenesisHeights: [['0', 123456]],
        nodeGraphHistory: [],
        nodeHistoricalChains: [],
        nodeLatestBehaviorHeight: 100,
        nodeNumberOfChains: 4,
        nodePackageVersion: '2.0',
        nodeServiceDate: '2025-01-01T00:00:00Z',
        nodeVersion: '1.0',
      };

      setupServerResponse(`${networkHost}/info`, 'json', mockResponse);

      const result = await walletSdk.getNetworkInfo(networkHost);

      expect(result).toEqual({
        nodeApiVersion: '1.0',
        nodeBlockDelay: 10,
        nodeGenesisHeights: [['0', 123456]],
        nodeGraphHistory: [],
        nodeHistoricalChains: [],
        nodeLatestBehaviorHeight: 100,
        nodeNumberOfChains: 4,
        nodePackageVersion: '2.0',
        nodeServiceDate: '2025-01-01T00:00:00Z',
        nodeVersion: '1.0',
      });
    });

    it('should return network info excluding nodeChains when nodeChains is missing', async () => {
      const mockResponse = {
        nodeApiVersion: '1.0',
        nodeBlockDelay: 10,
        nodeGenesisHeights: [['0', 123456]],
        nodeGraphHistory: [],
        nodeHistoricalChains: [],
        nodeLatestBehaviorHeight: 100,
        nodeNumberOfChains: 4,
        nodePackageVersion: '2.0',
        nodeServiceDate: '2025-01-01T00:00:00Z',
        nodeVersion: '1.0',
      };

      setupServerResponse(`${networkHost}/info`, 'json', mockResponse);

      const result = await walletSdk.getNetworkInfo(networkHost);

      expect(result).toEqual({
        nodeApiVersion: '1.0',
        nodeBlockDelay: 10,
        nodeGenesisHeights: [['0', 123456]],
        nodeGraphHistory: [],
        nodeHistoricalChains: [],
        nodeLatestBehaviorHeight: 100,
        nodeNumberOfChains: 4,
        nodePackageVersion: '2.0',
        nodeServiceDate: '2025-01-01T00:00:00Z',
        nodeVersion: '1.0',
      });
    });

    it('should return network info excluding nodeChains when nodeChains is null', async () => {
      const mockResponse = {
        nodeApiVersion: '1.0',
        nodeBlockDelay: 10,
        nodeChains: null,
        nodeGenesisHeights: [['0', 123456]],
        nodeGraphHistory: [],
        nodeHistoricalChains: [],
        nodeLatestBehaviorHeight: 100,
        nodeNumberOfChains: 4,
        nodePackageVersion: '2.0',
        nodeServiceDate: '2025-01-01T00:00:00Z',
        nodeVersion: '1.0',
      };

      setupServerResponse(`${networkHost}/info`, 'json', mockResponse);

      const result = await walletSdk.getNetworkInfo(networkHost);

      expect(result).toEqual({
        nodeApiVersion: '1.0',
        nodeBlockDelay: 10,
        nodeGenesisHeights: [['0', 123456]],
        nodeGraphHistory: [],
        nodeHistoricalChains: [],
        nodeLatestBehaviorHeight: 100,
        nodeNumberOfChains: 4,
        nodePackageVersion: '2.0',
        nodeServiceDate: '2025-01-01T00:00:00Z',
        nodeVersion: '1.0',
      });
    });
  });
});
