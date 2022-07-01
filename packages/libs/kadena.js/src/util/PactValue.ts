/** TODO:
 * - Should the helper functions `mkPactInt` and `mkPactDecimal` try to enforce the
 *   constraints the type definition explains.
 * - Should `isSafeInteger` be used?
 * - Should the function check if the string is a valid integer/decimal?
 * */

import type { PactDecimal, PactInt } from '@kadena/types';

export function mkPactInt(value: string): PactInt {
  return {
    int: value,
  };
}

export function mkPactDecimal(value: string): PactDecimal {
  return {
    decimal: value,
  };
}
