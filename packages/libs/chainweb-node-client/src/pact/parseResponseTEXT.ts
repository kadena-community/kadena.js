import type { Response as NodeFetchResponse } from 'node-fetch';

/**
 * Parses raw `fetch` response into a typed JSON value.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 *
 */
export async function parseResponseTEXT(
  raw: Promise<NodeFetchResponse>,
): Promise<string> {
  const response: NodeFetchResponse = await raw;
  if (response.ok) {
    const TEXTResponse: string = await response.text();
    return TEXTResponse;
  } else {
    // Handle API errors
    const TEXTResponse: string = await response.text();
    return Promise.reject(new Error(TEXTResponse));
  }
}
