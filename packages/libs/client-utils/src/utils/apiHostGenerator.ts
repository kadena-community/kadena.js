import type { createClient } from '@kadena/client';
import type { ChainId } from '@kadena/types';

type HostGeneratorFn = Parameters<typeof createClient>[0];

/**
 * @internal
 */
export const apiHostGenerator: HostGeneratorFn = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    case 'fast-development':
      return `http://localhost:8080/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    case 'testnet04':
    default:
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  }
};
