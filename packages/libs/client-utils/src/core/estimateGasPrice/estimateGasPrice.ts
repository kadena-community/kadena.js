import type { ChainId } from '@kadena/types';
import type { IBlockChainData } from './utils';
import { calculateGasInformation, calculateGasPrice } from './utils';

/**
 *
 * Fetches the current height of the chain from the cut endpoint.
 * @param host - The base URL of the Chainweb API.
 * @param chainId - The chain ID.
 * @param networkId - The network ID (e.g., mainnet01, testnet04).
 * @returns The current height of the chain.
 * @throws An error if the cut height cannot be fetched.
 * @example
 * const height = await getChainHeight({
 *   baseUrl: 'https://api.chainweb.com',
 *   chain: '0',
 *   networkId: 'mainnet01',
 * });
 * console.log('Current chain height:', height);
 * // Output: Current chain height: 12345678
 */
export const getChainHeight = async ({
  host,
  chainId,
  networkId,
}: {
  host: string;
  chainId: ChainId;
  networkId: string;
}) => {
  const baseUrl = host.endsWith('/') ? host.slice(0, host.length - 1) : host;
  const cut = (await fetch(`${baseUrl}/chainweb/0.0/${networkId}/cut`).then(
    (res) => res.json(),
  )) as { hashes: Record<string, { height: number }> };
  if (cut?.hashes?.[chainId]?.height) {
    return cut?.hashes[chainId].height;
  } else {
    throw new Error('Failed to fetch cut height');
  }
};

/**
 * Fetches block information from the Chainweb API.
 * @param host - The base URL of the Chainweb API.
 * @param chainId - The chain ID.
 * @param networkId - The network ID (e.g., mainnet01, testnet04).
 * @param minHeight - The minimum block height to fetch.
 * @param maxHeight - The maximum block height to fetch.
 * @returns An object containing block information.
 * @throws An error if the block information cannot be fetched.
 * @example
 * const blocks = await fetchBlockInformation({
 *   baseUrl: 'https://api.chainweb.com',
 *   chain: '0',
 *   networkId: 'mainnet01',
 *   minHeight: 12345678,
 *   maxHeight: 12345700,
 * });
 * console.log('Block information:', blocks);
 * // Output: Block information: { items: [...] }
 *
 */
export const fetchBlockInformation = async ({
  host,
  chainId,
  networkId,
  minHeight,
  maxHeight,
}: {
  host: string;
  chainId: string;
  networkId: string;
  minHeight: number;
  maxHeight: number;
}) => {
  const baseUrl = host.endsWith('/') ? host.slice(0, host.length - 1) : host;
  const blocks = (await fetch(
    `${baseUrl}/chainweb/0.0/${networkId}/chain/${chainId}/block?minheight=${minHeight}&maxheight=${maxHeight}`,
  ).then((res) => res.json())) as IBlockChainData;

  return blocks;
};

export interface IGasPriceEstimateProperties {
  host?: string;
  chainId: ChainId;
  networkId: string;
  height?: number | undefined;
  items?: number;
}

const DEFAULT_HOSTS: Record<string, string> = {
  mainnet01: 'https://api.chainweb.com',
  testnet04: 'https://api.testnet.chainweb.com',
};

/**
 * Fetches gas information for a given set of blocks. this can be used to calculate the gas price.
 * @param host - The base URL of the Chainweb API.
 * @param height - The block height to start fetching from (optional).
 * @param chainId - The chain ID.
 * @param networkId - The network ID (e.g., mainnet01, testnet04).
 * @param items - The number of blocks to fetch (default is 20).
 * @returns An array of gas information for each block.
 * @public
 */
export async function getBlocksGasInformation({
  host,
  height,
  chainId,
  networkId,
  items = 20,
}: IGasPriceEstimateProperties) {
  let maxHeight: number | undefined = height;
  if (host === undefined) {
    host = DEFAULT_HOSTS[networkId];
    if (!host) {
      throw new Error(`Unknown networkId: ${networkId}`);
    }
  }

  if (maxHeight === undefined) {
    // fetch the max height from the cut endpoint if not provided
    const blockHeight = await getChainHeight({
      host: host,
      chainId: chainId,
      networkId,
    });
    // consider one more block to account for the current block; we then fetch 21 blocks
    maxHeight = blockHeight + 1;
  }

  const minHeight = Math.max(maxHeight - items, 0);

  const blocks = await fetchBlockInformation({
    host: host,
    chainId: chainId,
    networkId,
    minHeight,
    maxHeight,
  });

  if (blocks.items.length === items + 1) {
    // ignore the first block if we have items + 1 blocks; because we added one more block to the max height
    blocks.items.shift();
  }

  return calculateGasInformation(blocks);
}

/**
 * Estimates the gas price based on the provided parameters.
 * @param host - The base URL of the Chainweb API.
 * @param height - The block height to start fetching from (optional).
 * @param chainId - The chain ID.
 * @param networkId - The network ID (e.g., mainnet01, testnet04).
 * @param items - The number of blocks to fetch (default is 20).
 * @returns The estimated gas price. which is the median of the minimum gas prices from the blocks. this discards blocks with no transactions.
 * @public
 */
export async function estimateGasPrice({
  host,
  height,
  chainId: chain,
  networkId,
  items = 20,
}: IGasPriceEstimateProperties) {
  const gasData = await getBlocksGasInformation({
    host,
    height,
    chainId: chain,
    networkId,
    items,
  });

  return calculateGasPrice(gasData);
}
