/**
 *
 * @alpha
 */
export type ReadKeyset = <TKey extends string>(
  key: TKey,
) => () => `(read-keyset "${TKey}")`;

/**
 *
 * @alpha
 */
export const readKeyset: ReadKeyset = (key) => () => `(read-keyset "${key}")`;

/**
 *
 * @alpha
 */
export const literal: <T extends string | Record<string, unknown>>(
  value: T,
) => () => T = (value) => () => value;
