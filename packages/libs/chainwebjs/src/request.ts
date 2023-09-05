import ResponseError from './ResponseError';
import type { IRetryOptions } from './types';

import type { Response } from 'cross-fetch';
import pRetry, { AbortError } from 'p-retry';

export function transFormUrl(url: URL): string {
  return url as unknown as string;
}

/**
 * Retry a fetch callback
 *
 * @param fetchAction - fetch callback
 * @param retryOptions - retry options object as accepted by the retry package
 *
 * @alpha
 */
const errorCodes: Array<number> = [408, 423, 425, 429, 500, 502, 503, 504];

export async function retryFetch(
  fetchAction: () => Promise<Response>,
  retryOptions: IRetryOptions = {},
): Promise<Response> {
  // set default retryOptions, with any passed-in retryOptions overriding the defaults
  const options: IRetryOptions = {
    onFailedAttempt: (x) => console.log('failed fetch attempt:', x.message),
    retries: 2,
    minTimeout: 500,
    randomize: true,
    retry404: false,
    ...retryOptions,
  };

  const retry404 = options.retry404;

  const run = async (): Promise<Response> => {
    const response = await fetchAction();
    if (response.status === 200) {
      return response;
    } else if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      (response.status === 404 && retry404) ||
      errorCodes.indexOf(response.status) !== -1
    ) {
      throw new ResponseError(response);
    } else {
      throw new AbortError(new ResponseError(response));
    }
  };

  return pRetry(run, options);
}

/**
 * Create URL for the Chainweb API
 *
 * @param network - chainweb network
 * @param host - chainweb api host
 * @param pathSuffix - suffix of the path that is appended to the path of the base URL
 *
 * @alpha
 */
export function baseUrl(
  network: string,
  host: string,
  pathSuffix: string,
): URL {
  return new URL(`${host}/chainweb/0.0/${network}/${pathSuffix}`);
}

/**
 * Create URL for a chain endpoint of the Chainweb API
 *
 * @param chainId - a chain id that is valid for the network
 * @param network - chainweb network
 * @param host - chainweb api host
 * @param pathSuffix - suffix of the path that is appended to the path of the chain URL
 *
 * @alpha
 */
export function chainUrl(
  chainId: number | string,
  pathSuffix: string,
  network: string,
  host: string,
): URL {
  if (chainId === null) {
    throw new Error('missing chainId parameter');
  }
  return baseUrl(network, host, `chain/${chainId}/${pathSuffix}`);
}
