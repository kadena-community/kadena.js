/**
 * Parses raw `fetch` response into text.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 * @alpha
 */
export async function parseResponseTEXT(response: Response): Promise<string> {
  if (response.ok) {
    return await response.text();
  } else {
    // Handle API errors
    const TEXTResponse: string = await response.text();
    return Promise.reject(new Error(TEXTResponse));
  }
}
