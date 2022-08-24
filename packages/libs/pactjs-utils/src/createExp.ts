import { PactCode, PactValue } from '@kadena/types';
/**
 * Variadic function to form a lisp s-expression application.
 * Encases arguments in parens and intercalates with a space.
 * @alpha
 */
export function createExp(firstArg: string, ...args: PactValue[]): PactCode {
  return `(${firstArg} ${Array.prototype.slice.call(args, 0).join(' ')})`;
}
