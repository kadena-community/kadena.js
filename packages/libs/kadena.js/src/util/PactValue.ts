/** TODO:
 * - Should the helper functions `mkPactInt` and `mkPactDecimal` try to enforce the
 *   constraints the type definition explains.
 * - Should `isSafeInteger` be used?
 * - Should the function check if the string is a valid integer/decimal?
 * */

import type { IPactDecimal, IPactInt } from '@kadena/types';

/**
 * @alpha
 */
export function mkPactInt(value: string): IPactInt {
  return {
    int: value,
  };
}

/**
 * @alpha
 */
export function mkPactDecimal(value: string): IPactDecimal {
  return {
    decimal: value,
  };
}
