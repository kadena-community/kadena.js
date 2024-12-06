import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { exchange } from '../exchange.js';
import type { IEthvmDevTokenInfo } from '../interface.js';

type Token = 'kadena' | 'ethereum';

const tokens: Token[] = ['kadena', 'ethereum'];

const mockSuccessResponse = {
  data: {
    getCoinGeckoTokenMarketDataByIds: [
      {
        current_price: 1.5,
        max_supply: 1000000,
        total_supply: 900000,
        circulating_supply: 850000,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        low_24h: 1.4,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        high_24h: 1.6,
      },
      {
        current_price: 3000,
        max_supply: 21000000,
        total_supply: 18500000,
        circulating_supply: 18000000,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        low_24h: 2950,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        high_24h: 3050,
      },
    ],
  },
};

const mockFailureResponse = {
  error: 'Something went wrong',
};

describe('exchange.getEthvmDevTokenInfo', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return token info when API call is successful', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockSuccessResponse),
    } as unknown as Response);

    const result = await exchange.getEthvmDevTokenInfo<Token>(tokens);

    const expected: Record<Token, IEthvmDevTokenInfo | undefined> = {
      kadena: {
        currentPrice: 1.5,
        maxSupply: 1000000,
        totalSupply: 900000,
        circulatingSupply: 850000,
        low24h: 1.4,
        high24h: 1.6,
      },
      ethereum: {
        currentPrice: 3000,
        maxSupply: 21000000,
        totalSupply: 18500000,
        circulatingSupply: 18000000,
        low24h: 2950,
        high24h: 3050,
      },
    };

    expect(result).toEqual(expected);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (global.fetch as unknown as Mock).mock.calls[0];
    expect(fetchCall[0]).toBe('https://api-v2.ethvm.dev/');

    const fetchOptions = fetchCall[1];
    expect(fetchOptions.method).toBe('POST');
    expect(fetchOptions.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(fetchOptions.body);
    expect(body.operationName).toBeNull();
    expect(body.variables).toEqual({ tokens });
    expect(body.query).toContain('query getCoinGeckoTokenMarketDataByIds');
  });

  it('should assign undefined when data entries are null', async () => {
    const tokensWithNullData: Token[] = ['kadena', 'ethereum'];

    const mockNullDataResponse = {
      data: {
        getCoinGeckoTokenMarketDataByIds: [null, null],
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockNullDataResponse),
    } as unknown as Response);

    const result =
      await exchange.getEthvmDevTokenInfo<Token>(tokensWithNullData);

    const expected: Record<Token, IEthvmDevTokenInfo | undefined> = {
      ethereum: {
        circulatingSupply: undefined,
        currentPrice: undefined,
        high24h: undefined,
        low24h: undefined,
        maxSupply: undefined,
        totalSupply: undefined,
      },
      kadena: {
        circulatingSupply: undefined,
        currentPrice: undefined,
        high24h: undefined,
        low24h: undefined,
        maxSupply: undefined,
        totalSupply: undefined,
      },
    };

    expect(result).toEqual(expected);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (global.fetch as unknown as Mock).mock.calls[0];
    expect(fetchCall[0]).toBe('https://api-v2.ethvm.dev/');
    expect(fetchCall[1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = JSON.parse(fetchCall[1].body);
    expect(body.operationName).toBeNull();
    expect(body.variables).toEqual({ tokens: tokensWithNullData });
    expect(body.query).toContain('query getCoinGeckoTokenMarketDataByIds');
  });

  it('should return undefined for each token when API call fails', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    const result = await exchange.getEthvmDevTokenInfo<Token>(tokens);

    const expected: Record<Token, undefined> = {
      kadena: undefined,
      ethereum: undefined,
    };

    expect(result).toEqual(expected);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (global.fetch as unknown as Mock).mock.calls[0];
    expect(fetchCall[0]).toBe('https://api-v2.ethvm.dev/');
    expect(fetchCall[1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = JSON.parse(fetchCall[1].body);
    expect(body.operationName).toBeNull();
    expect(body.variables).toEqual({ tokens });
    expect(body.query).toContain('query getCoinGeckoTokenMarketDataByIds');
  });

  it('should return undefined for each token when API response is malformed', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockFailureResponse),
    } as unknown as Response);

    const result = await exchange.getEthvmDevTokenInfo<Token>(tokens);

    const expected: Record<Token, undefined> = {
      kadena: undefined,
      ethereum: undefined,
    };

    expect(result).toEqual(expected);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (global.fetch as unknown as Mock).mock.calls[0];
    expect(fetchCall[0]).toBe('https://api-v2.ethvm.dev/');
    expect(fetchCall[1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = JSON.parse(fetchCall[1].body);
    expect(body.operationName).toBeNull();
    expect(body.variables).toEqual({ tokens });
    expect(body.query).toContain('query getCoinGeckoTokenMarketDataByIds');
  });

  it('should handle empty token array', async () => {
    // Mock the fetch implementation
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({
        data: { getCoinGeckoTokenMarketDataByIds: [] },
      }),
    } as unknown as Response);

    const result = await exchange.getEthvmDevTokenInfo<string>([]);

    const expected: Record<string, undefined> = {};

    expect(result).toEqual(expected);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (global.fetch as unknown as Mock).mock.calls[0];
    expect(fetchCall[0]).toBe('https://api-v2.ethvm.dev/');
    expect(fetchCall[1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = JSON.parse(fetchCall[1].body);
    expect(body.operationName).toBeNull();
    expect(body.variables).toEqual({ tokens: [] });
    expect(body.query).toContain('query getCoinGeckoTokenMarketDataByIds');
  });
});
