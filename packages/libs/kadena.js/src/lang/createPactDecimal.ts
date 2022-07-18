import type { IPactDecimal } from '@kadena/types';

/**
 * Creates Pact Decimal object to be used in envData with 'read-integer', or 'read-msg', or in cap argument list.
 *
 * @alpha
 */

export function createPactDecimal(value: string): IPactDecimal {
  if (Number.isNaN(value)) {
    throw new Error('Input is not a number');
  } else {
    return {
      decimal: value,
    };
  }
}
