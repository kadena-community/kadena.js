import { Response } from 'cross-fetch';

/**
 * Parses raw `fetch` response into a typed JSON value.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 *
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  } else {
    // Handle API errors
    const TEXTResponse: string = await response.text();
    return Promise.reject(new Error(TEXTResponse));
  }
}
