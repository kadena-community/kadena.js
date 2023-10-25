import base64url from 'base64url';
import fetch from 'cross-fetch';
import { currentCut } from './cut';
import { pageIterator } from './paging';
import { baseUrl, chainUrl, retryFetch, transFormUrl } from './request';
import type {
  IBlockHeader,
  IBlockPayload,
  ICoinbase,
  ICutPeerItem,
  IPagedResponse,
  IRetryOptions,
  ITransactionElement,
  ITransactionPayload,
} from './types';

/**
 * Yields items from pages in reverse order.
 * WARNING: This awaits and buffers all pages before returning.
 *
 * @param query - function that returns a page of items
 * @param n - optional upper limit and the number of returned items
 *
 * @alpha
 */
async function reversePages<T>(
  query: (
    next: string | undefined,
    limit: number | undefined,
  ) => Promise<IPagedResponse<T>>,
  n: number | undefined,
): Promise<T[]> {
  const iter = pageIterator(query, n);
  const ps = [] as T[][];
  for await (const p of iter) {
    ps.unshift(p.reverse());
  }
  return ps.flat();
}

/**
 * Parses raw `fetch` response into a typed JSON value
 * @param response - `fetch` response
 *
 * @alpha
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  } else {
    try {
      const textResponse: string = await response.text();
      return Promise.reject(new Error(textResponse));
    } catch (error) {
      // return response as unknown as T;
      throw new Error(error.message);
    }
  }
}

/**
 * Decode base64url encoded JSON text
 *
 * @param txt - base64url encoded json text
 *
 * @alpha
 */
export function base64json(txt: string): string {
  return JSON.parse(base64url.decode(txt));
}

/**
 * Internal Utilities
 *
 * Anything that is exported within the `internal` namespace
 * is not covered by semantic versioning policy.
 */

/**
 * Page of P2P peers of the cut network
 *
 * @param network - chainweb network
 * @param host - chainweb api host
 * @param retryOptions - retry options object as accepted by the retry package
 *
 * @alpha
 */
export async function cutPeerPage(
  network: string,
  host: string,
  retryOptions?: IRetryOptions,
): Promise<IPagedResponse<ICutPeerItem>> {
  const result = await retryFetch(
    () => fetch(transFormUrl(baseUrl(network, host, 'cut/peer'))),
    retryOptions,
  );
  return parseResponse<IPagedResponse<ICutPeerItem>>(result);
}

/**
 * A signle block header page in decending order
 *
 * @param chainId - a chain id that is valid for the network
 * @param upper - only antecessors of these block hashes are returned. Note that if this is undefined, the result is empty.
 * @param lower - no antecessors of these block hashes are returned.
 * @param minHeight - if given, minimum height of returned headers
 * @param maxHeight - if given, maximum height of returned headers
 * @param n - if given, limits the number of results. This is an upper limit. The actual number of returned items can be lower.
 * @param next - if given, provides a cursor that points to the next page of the result. The cursor is the `next` property of the previous page.
 * @param format - encoding of result headers. Possible values are 'json' (default) and 'binary'.
 * @param network - chainweb network
 * @param host - chainweb api host
 * @param retryOptions - retry options object as accepted by the retry package
 *
 * @alpha
 */

export async function branchPage(
  chainId: number | string,
  upper: string[],
  lower: string[],
  minHeight: number | undefined,
  maxHeight: number | undefined,
  n: number | undefined,
  next: string | undefined,
  format: string | undefined,
  network: string,
  host: string,
  retryOptions?: IRetryOptions,
): Promise<IPagedResponse<IBlockHeader>> {
  /* Format and Accept header value */
  format = format !== null ? format : 'json';
  const accept = 'application/json;blockheader-encoding=object';

  const url = chainUrl(chainId, 'header/branch', network, host);

  if (minHeight !== undefined) {
    url.searchParams.append('minheight', minHeight as unknown as string);
  }
  if (maxHeight !== undefined) {
    url.searchParams.append('maxheight', maxHeight as unknown as string);
  }
  if (n !== undefined) {
    url.searchParams.append('limit', n as unknown as string);
  }
  if (next !== undefined) {
    url.searchParams.append('next', next);
  }

  const body = {
    upper: upper,
    lower: lower,
  };

  const result = await retryFetch(
    () =>
      fetch(transFormUrl(url), {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: accept,
        },
      }),
    retryOptions,
  );

  return parseResponse<IPagedResponse<IBlockHeader>>(result);
}

/**
 * Return block headers from chain
 *
 * @param chainId - a chain id that is valid for the network
 * @param upper - only antecessors of these block hashes are returned. Note that if this is undefined, the result is empty.
 * @param lower - no antecessors of these block hashes are returned.
 * @param minHeight - if given, minimum height of returned headers
 * @param maxHeight - if given, maximum height of returned headers
 * @param n - if given, limits the number of results. This is an upper limit. The actual number of returned items can be lower.
 * @param format- encoding of result headers. Possible values are 'json' (default) and 'binary'.
 * @param network - chainweb network
 * @param host - chainweb api host
 * @param retryOptions - retry options object as accepted by the retry package
 *
 * @alpha
 */

export async function branch(
  chainId: number | string,
  upper: string[],
  lower: string[],
  minHeight: number | undefined,
  maxHeight: number | undefined,
  n: number | undefined,
  format: string | undefined,
  network: string,
  host: string,
  retryOptions?: IRetryOptions,
): Promise<IBlockHeader[]> {
  return reversePages<IBlockHeader>(async (next, limit) => {
    return branchPage(
      chainId,
      upper,
      lower,
      minHeight,
      maxHeight,
      limit,
      next,
      format,
      network,
      host,
      retryOptions,
    );
  }, n);
}

/**
 * Headers from the current branch of the chain
 *
 * @param chainId - a chain id that is valid for the network
 * @param start - start block height
 * @param end - end block height
 * @param n - if given, limits the number of results. This is an upper limit. The actual number of returned items can be lower.
 * @param format - encoding of result headers. Possible values are 'json' (default) and 'binary'.
 * @param network - chainweb network
 * @param host - chainweb api host
 *
 * @alpha
 */
export async function currentBranch(
  chainId: number | string,
  start: number,
  end: number,
  n: number | undefined,
  format: string,
  network: string,
  host: string,
): Promise<IBlockHeader[]> {
  const { hashes } = await currentCut(network, host);
  return branch(
    chainId,
    [hashes[`${chainId}`].hash],
    [],
    start,
    end,
    n,
    format,
    network,
    host,
  );
}

/**
 * Payloads with outputs
 *
 * @param chainId - a chain id that is valid for the network
 * @param hashes - array of block payload hashes
 * @param format - encoding of payload properties. Possible values are 'json' (default) and 'base64'.
 * @param network- chainweb network
 * @param host - chainweb api host
 * @param retryOptions - retry options object as accepted by the retry package
 * @param n - if given, limits the number of results.
 *
 * @alpha
 */

export async function payloads(
  chainId: number | string,
  hashes: string[],
  network: string,
  host: string,
  retryOptions?: IRetryOptions,
  n?: number,
): Promise<IBlockPayload<ITransactionElement>[]> {
  const path =
    n !== undefined ? `payload/outputs/batch?${n}` : 'payload/outputs/batch';
  const url = chainUrl(chainId, path, network, host);

  const response = await retryFetch(
    () =>
      fetch(transFormUrl(url), {
        method: 'post',
        body: JSON.stringify(hashes),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    retryOptions,
  );

  const res = await parseResponse<IBlockPayload<string[]>[]>(response);

  const result = res.map((data) => {
    const transaction: IBlockPayload<ITransactionElement> = {
      ...data,
      minerData: base64json(data.minerData),
      coinbase: base64json(data.coinbase),
      transactions: data.transactions.map((txs) => {
        const tx = base64json(txs[0]) as unknown as ITransactionPayload;
        const out = base64json(txs[1]) as unknown as ICoinbase;
        tx.cmd = JSON.parse(tx.cmd as unknown as string);
        return {
          transaction: tx,
          output: out,
        } as ITransactionElement;
      }),
    };
    return transaction;
  });
  return result;
}
