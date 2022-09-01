import type { Response as NodeFetchResponse } from 'node-fetch';

/**
 * Parses raw `fetch` response into a typed JSON value.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 *
 */
export async function parseResponse<T>(
  raw: Promise<NodeFetchResponse>,
): Promise<T> {
  const response: NodeFetchResponse = await raw;
  if (response.ok) {
    const JSONResponse = (await response.json()) as T;
    return JSONResponse;
  } else {
    // Handle API errors
    const TEXTResponse: string = await response.text();
    return Promise.reject(new Error(TEXTResponse));
  }
}
