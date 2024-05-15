import type { ILocalCommandResult, ILocalResult } from './interfaces/PactAPI';
/**
 * Parses raw `fetch` response into a typed JSON value.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 * @alpha
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  } else {
    try {
      // Handle API errors

      const textResponse: string = await response.text();
      return Promise.reject(new Error(textResponse));
    } catch (error) {
      return response as unknown as T;
    }
  }
}

/**
 * @alpha
 */
export function parsePreflight(
  commandResult: ILocalResult,
): ILocalCommandResult {
  if ('preflightResult' in commandResult) {
    return {
      ...commandResult.preflightResult,
      preflightWarnings: commandResult.preflightWarnings,
    };
  } else return commandResult;
}
