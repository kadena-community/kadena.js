import { PactNumber } from '@kadena/pactjs';
import { PactLiteral } from '@kadena/types';

/**
 * @internal
 */
export function parseType(
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
    case 'string':
      return `"${arg}"`;
    case 'function':
      return arg();
    default:
      return arg;
  }
}
