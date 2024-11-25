import type { ChainId } from '@kadena/client';
import { createClient } from '@kadena/client';

export type ChainwebHostGenerator = (options: {
  networkId: string;
  chainId: string;
}) => string;

export const chainwebHostMap: Record<string, string | string[]> = {
  mainnet01: 'https://api.chainweb.com',
  testnet04: 'https://api.testnet.chainweb.com',
  testnet05: 'https://api.testnet.chainweb.com',
};

export const getChainIdByNetwork = (networkId: string): ChainId => {
  return networkId.includes('testnet') ? '1' : '15';
};

export const defaultChainwebHostGenerator: ChainwebHostGenerator = (
  options,
) => {
  return `${chainwebHostMap[options.networkId]}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`;
};

export const getClient = (() => {
  const clientCache: Record<string, ReturnType<typeof createClient>> = {};

  return (networkId: string) => {
    if (!clientCache[networkId]) {
      clientCache[networkId] = createClient((options) =>
        defaultChainwebHostGenerator({
          ...options,
          networkId,
          chainId: getChainIdByNetwork(networkId),
        }),
      );
    }
    return clientCache[networkId];
  };
})();
