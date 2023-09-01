import { type PactCode, type PactValue } from '@kadena/types';
/**
 * Variadic function to form a lisp s-expression application.
 * Encases arguments in parens and intercalates with a space.
 * @alpha
 */
export function createExp(firstArg: string, ...args: PactValue[]): PactCode {
  return `(${firstArg}${args.length > 0 ? ' ' : ''}${Array.prototype.slice
    .call(args, 0)
    .join(' ')})`;
}
