import type { IEthvmDevTokenInfo } from './interface.js';

export const exchange = {
  async getEthvmDevTokenInfo<T extends string>(
    tokens = ['kadena'] as T[],
  ): Promise<Record<T, IEthvmDevTokenInfo | undefined>> {
    try {
      // Search on https://www.coingecko.com and copy "API ID"
      const response = await fetch(`https://api-v2.ethvm.dev/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName: null,
          variables: { tokens },
          query: `query getCoinGeckoTokenMarketDataByIds($tokens: [String!]!) {
            getCoinGeckoTokenMarketDataByIds(coinGeckoTokenIds: $tokens) {
              current_price
              max_supply
              total_supply
              circulating_supply
              low_24h
              high_24h
            }
          }`,
        }),
      });
      const json: any = await response.json();
      const data = json?.data?.getCoinGeckoTokenMarketDataByIds as (Record<
        string,
        number
      > | null)[];
      return data.reduce(
        (acc, info, index) => {
          acc[tokens[index]] = {
            currentPrice: info?.current_price ?? undefined,
            circulatingSupply: info?.circulating_supply ?? undefined,
            maxSupply: info?.max_supply ?? undefined,
            totalSupply: info?.total_supply ?? undefined,
            low24h: info?.low_24h ?? undefined,
            high24h: info?.high_24h ?? undefined,
          };
          return acc;
        },
        {} as Record<T, IEthvmDevTokenInfo>,
      );
    } catch (error) {
      return Object.fromEntries(
        tokens.map((token) => [token, undefined]),
      ) as Record<T, undefined>;
    }
  },
};
