/**
 * Variadic function to form a lisp s-expression application.
 * Encases arguments in parens and intercalates with a space.
 */
export function createExp(firstArg: string, ...args: unknown[]): string {
  return `(${firstArg} ${Array.prototype.slice.call(args, 0).join(' ')})`;
}
