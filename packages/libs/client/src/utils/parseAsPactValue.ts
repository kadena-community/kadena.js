import { PactNumber } from '@kadena/pactjs';
import { PactLiteral } from '@kadena/types';

const isDate = (obj: unknown): obj is Date => {
  if (typeof obj === 'object' && obj instanceof Date) return true;
  return false;
};

/**
 * @internal
 */
export function parseAsPactValue(
  arg: PactLiteral | (() => string),
): string | number | boolean {
  switch (typeof arg) {
    case 'object': {
      if ('decimal' in arg) {
        return new PactNumber(arg.decimal).toDecimal();
      }
      if ('int' in arg) {
        return new PactNumber(arg.int).toInteger();
      }
      if (isDate(arg)) return `(time "${arg.toISOString()}")`;

      return arg;
    }
    case 'number':
      throw new Error(
        'Type `number` is not allowed in the command. Use `{ decimal: 10 }` or `{ int: 10 }` instead',
      );
    case 'string':
      return `"${arg}"`;
    case 'function':
      return arg();
    case 'boolean':
      return arg;
    default:
      return arg;
  }
}
