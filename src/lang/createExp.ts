/**
 * Variadic function to form a lisp s-expression application.
 * Encases arguments in parens and intercalates with a space.
 */
export default function createExp(firstArg: string, ...args: any[]): string {
  return `(${firstArg} ${Array.prototype.slice
    .call(args, 0)
    .map((arg) => JSON.stringify(arg))
    .join(' ')})`;
}
