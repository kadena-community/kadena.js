import type { ClientRequestInit } from './local';

/**
 * Formats API request body to use with `fetch` function.
 *
 * Corresponds to `mkReq` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L533
 * @alpha
 */
export function stringifyAndMakePOSTRequest<T>(
  body: T,
  requestInit?: ClientRequestInit,
) {
  return {
    ...requestInit,
    method: 'POST',
    body: JSON.stringify(body),
  };
}
