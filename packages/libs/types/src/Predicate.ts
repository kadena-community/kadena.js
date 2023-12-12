/**
 * @alpha
 */
export const Predicate = {
  keysAll: 'keys-all',
  keysTwo: 'keys-2',
  keysAny: 'keys-any',
} as const;

/**
 * @alpha
 */
export type TPredicate =
  | (typeof Predicate)[keyof typeof Predicate]
  | string
  | undefined;
