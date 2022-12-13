import pRetry from 'p-retry';
import { IRetryOptions } from './types';
import { ResponseError } from './ResponseError';

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

export function retryFetch(
  fetchAction: () => Promise<Response>,
  retryOptions?: IRetryOptions,
): Promise<Response> {
  // set default retryOptions, with any passed-in retryOptions overriding the defaults
  retryOptions = {
    onFailedAttempt: (x) => console.log('failed fetch attempt:', x.message),
    retries: 2,
    minTimeout: 500,
    randomize: true,
    retry404: false,
    ...(retryOptions && { ...retryOptions }),
  };

  const retry404 = retryOptions.retry404;

  const run = async (): Promise<Response> => {
    try {
      const response = await fetchAction();
      if (response.status === 200) {
        return response;

        // retry 404 if requested
      } else if (response.status === 404 && retry404) {
        // not found
        throw new ResponseError(response);

        // retry potentially ephemeral failure conditions
      } else if (response.status === 408) {
        // response timeout
        throw new ResponseError(response);
      } else if (response.status === 423) {
        // locked
        throw new ResponseError(response);
      } else if (response.status === 425) {
        // too early
        throw new ResponseError(response);
      } else if (response.status === 429) {
        // too many requests
        throw new ResponseError(response);
      } else if (response.status === 500) {
        // internal server error
        throw new ResponseError(response);
      } else if (response.status === 502) {
        // bad gateway
        throw new ResponseError(response);
      } else if (response.status === 503) {
        // service unavailable
        throw new ResponseError(response);
      } else if (response.status === 504) {
        // gateway timeout
        throw new ResponseError(response);
      } else {
        // unknown error
        throw new ResponseError(response);
      }
    } catch (e) {
      throw new Error(`Error fetching: ${e}`);
    }
  };

  return pRetry(run, retryOptions);
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
  network: string,
  host: string,
  pathSuffix: string,
): URL {
  if (chainId === null) {
    throw new Error('missing chainId parameter');
  }
  return baseUrl(network, host, `chain/${chainId}/${pathSuffix}`);
}
