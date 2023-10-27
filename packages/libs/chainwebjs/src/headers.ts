import type EventSource from 'eventsource';
import { HeaderBuffer } from './HeaderBuffer';
import { currentCut } from './cut';
import { branch, currentBranch } from './internal';
import { baseUrl } from './request';
import type { IBlockHeader, IBufferHeader } from './types';
import { buildEventSource } from './utils';

/**
 * Headers from a range of block heights
 *
 * @param chainId - a chain id that is valid for the network
 * @param start - start block height
 * @param end - end block height
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */

export function headers(
  chainId: number | string,
  start: number,
  end: number,
  network: string,
  host: string,
): Promise<IBlockHeader[]> {
  return currentBranch(chainId, start, end, undefined, 'json', network, host);
}

/**
 * Recent Headers
 *
 * @param chainId - a chain id that is valid for the network
 * @param depth - confirmation depth. Only headers at this depth are returned
 * @param n - maximual number of headers that are returned. The actual number of returned headers may be lower.
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */

export async function recentHeaders(
  chainId: number | string,
  depth: number = 0,
  n: number = 1,
  network: string,
  host: string,
): Promise<IBlockHeader[]> {
  const cut = await currentCut(network, host);
  const start = cut.hashes['0'].height - depth - n + 1;
  const end = cut.hashes['0'].height - depth;
  const upper = cut.hashes[`${chainId}`].hash;

  return branch(chainId, [upper], [], start, end, n, 'json', network, host);
}

/**
 * Apply callback to new header.
 *
 * @param depth - confirmation depth at which blocks are yielded
 * @param chainIds - array of chainIds from which blocks are included
 * @param callback - function that is called for each header
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */

export function headerStream(
  depth: number,
  chainIds: number[],
  callback: (header: IBlockHeader) => void,
  network: string,
  host: string,
): EventSource {
  return chainUpdates(
    depth,
    chainIds,
    (u) => callback(u.header),
    network,
    host,
  );
}

/**
 * Query block header by its block hash
 *
 * @param chainId - a chain id that is valid for the network
 * @param hash - block hash
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */

export async function headerByBlockHash(
  chainId: number | string,
  hash: string,
  network: string,
  host: string,
): Promise<IBlockHeader> {
  const x = await branch(
    chainId,
    [hash],
    [],
    undefined,
    undefined,
    1,
    undefined,
    network,
    host,
  );
  return x[0];
}

/**
 * Query block header by its height
 *
 * @param chainId - a chain id that is valid for the network
 * @param hash - block height
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */
export const headerByHeight = async (
  chainId: number | string,
  height: number,
  network: string,
  host: string,
): Promise<IBlockHeader> => {
  const x = await headers(chainId, height, height, network, host);
  return x[0];
};

/**
 * @param callback - function that is called for each update
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */

/**
 * @param {headerCallback} callback - function that is called for each update
 * @param {string} [network="mainnet01"] - chainweb network
 * @param {string} [host="https://api.chainweb.com"] - chainweb api host
 */
const headerUpdates = (
  callback: (header: IBufferHeader) => void,
  network: string,
  host: string,
): EventSource => {
  const url = baseUrl(network, host, 'header/updates');

  const es = buildEventSource(`${url}`);
  es.onerror = (err) => {
    throw err;
  };

  es.addEventListener('BlockHeader', ((evt: MessageEvent): void => {
    const messageEvent = evt as MessageEvent;
    callback(JSON.parse(messageEvent.data) as IBufferHeader);
  }) as EventListener);
  return es;
};

/**
 * Apply callback to new updates.
 *
 * Same as headerUpdates, but filters for chains and only processes header
 * updates that have reached the given confirmation depth in the chain.
 *
 * @param depth - confirmation depth at which blocks are yielded
 * @param chainIds - array of chainIds from which blocks are included
 * @param callback - function that is called for each update
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */
export function chainUpdates(
  depth: number,
  chainIds: number[],
  callback: (header: IBufferHeader) => void,
  network: string,
  host: string,
): EventSource {
  const bs = {} as {
    [key: string]: HeaderBuffer;
  };
  chainIds.forEach((x) => (bs[x] = new HeaderBuffer(depth, callback)));
  return headerUpdates(
    (hdr) => {
      const x = bs[hdr.header.chainId];
      return x === undefined || x.add === undefined ? undefined : x.add(hdr);
    },
    network,
    host,
  );
}
