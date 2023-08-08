/**
 * Helper function that returns `(read-keyset "<key")` Pact expression
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const readKeyset = (key: string) => () => `(read-keyset "${key}")`;

/**
 * Will create a literal value without surrounding quotes `"`
 * @public
 */
export const literal: <T extends string | Record<string, unknown>>(
  value: T,
) => () => T = (value) => () => value;
