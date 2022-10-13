import { PactNumber } from '@kadena/pactjs';

/**
 * @internal
 */
export function parseType(
  arg: string | number | boolean | (() => string),
): string | number | boolean {
  switch (typeof arg) {
    case 'string':
      return `"${arg}"`;
    case 'number':
      return new PactNumber(arg).toDecimal();
    case 'boolean':
      return arg;
    case 'function':
      return arg();
  }
}
