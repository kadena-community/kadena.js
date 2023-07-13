import { PactNumber } from '@kadena/pactjs';
import { PactLiteral } from '@kadena/types';

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
      return true;
    default:
      return arg;
  }
}
