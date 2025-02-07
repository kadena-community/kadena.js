/**
 * Pact error codes
 * @public
 */
export type PactErrorCode =
  | 'RECORD_NOT_FOUND'
  | 'DEFPACT_COMPLETED'
  | 'CANNOT_RESOLVE_MODULE'
  | 'EMPTY_CODE'
  | 'ERROR';

/**
 * Parses an error message to extract the Pact error code.
 *
 * This function is compatible with both Pact 4 and Pact 5 error formats.
 *
 * @param  error - The error returned by Pact.
 * @returns {PactErrorCode} - The extracted Pact error ('ERROR' if the error code could not be extracted).
 *
 * @example
 * ```ts
 * const client = createClient();
 * const response = await client.local(tx);
 * if (response.result.status === 'failure') {
 *   if (getPactErrorCode(response.result.error) === 'RECORD_NOT_FOUND') {
 *     // handle record not found error
 *   }
 * }
 * ```
 * @public
 */
export function getPactErrorCode(
  error: { message: string | undefined } | undefined,
): PactErrorCode {
  const message = error ? error.message : '';
  if (typeof message === 'string') {
    if (
      ['row not found', 'No value found'].some((str) => message.includes(str))
    ) {
      return 'RECORD_NOT_FOUND';
    }
    if (
      ['pact completed', 'defpact execution already completed'].some((str) =>
        message.includes(str),
      )
    ) {
      return 'DEFPACT_COMPLETED';
    }

    if (
      ['Cannot resolve', 'has no such member'].some((str) =>
        message.includes(str),
      )
    ) {
      return 'CANNOT_RESOLVE_MODULE';
    }

    if (message.includes('Failed reading: mzero')) {
      return 'EMPTY_CODE';
    }
  }
  return 'ERROR';
}
