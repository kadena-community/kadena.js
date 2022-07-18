import type { IPactInt } from '@kadena/types';

/**
 * Creates Pact Integer object to be used in envData with 'read-integer', or 'read-msg', or in cap argument list.
 *
 * @alpha
 */

export function createPactInteger(value: string): IPactInt {
  if (Number.isNaN(value)) {
    throw new Error('Input is not a number');
  } else if (Number.isInteger(Number(value))) {
    throw new Error('Input is not an integer');
  } else {
    return {
      int: value,
    };
  }
}
