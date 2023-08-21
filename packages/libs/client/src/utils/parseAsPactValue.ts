import { PactNumber } from '@kadena/pactjs';
import { PactValue } from '@kadena/types';

import { Literal } from './pact-helpers';

const isDate = (obj: unknown): obj is Date => {
  if (typeof obj === 'object' && obj instanceof Date) return true;
  return false;
};

/**
 * @internal
 */
export function parseAsPactValue(
  input: PactValue | (() => string) | Literal,
): string | number | boolean {
  if (input instanceof Literal) {
    return input.getValue();
  }
  switch (typeof input) {
    case 'object': {
      if ('decimal' in input) {
        return new PactNumber(input.decimal).toDecimal();
      }
      if ('int' in input) {
        return new PactNumber(input.int).toInteger();
      }
      if (isDate(input)) {
        const isoTime = `${input.toISOString().split('.')[0]}Z`;
        return `(time "${isoTime}")`;
      }
      // to prevent from creating [object Object]
      return JSON.stringify(input);
    }
    case 'number':
      throw new Error(
        'Type `number` is not allowed in the command. Use `{ decimal: 10 }` or `{ int: 10 }` instead',
      );
    case 'string':
      return `"${input}"`;
    case 'function':
      return input();
    case 'boolean':
      return input;
    default:
      return input;
  }
}
