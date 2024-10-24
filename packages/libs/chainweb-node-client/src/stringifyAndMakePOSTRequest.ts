/**
 * Formats API request body to use with `fetch` function.
 *
 * Corresponds to `mkReq` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L533
 * @alpha
 */
export function stringifyAndMakePOSTRequest<T>(
  body: T,
  headers: Record<string, string> = {},
) {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    method: 'POST',
    body: JSON.stringify(body),
  };
}
