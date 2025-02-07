export type PactErrorCode =
  | 'RECORD_NOT_FOUND'
  | 'DEFPACT_COMPLETED'
  | 'CANNOT_RESOLVE_MODULE'
  | 'EMPTY_CODE'
  | 'ERROR';

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
