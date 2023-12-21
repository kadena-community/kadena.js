/**
 * The most common predicate values are 'keys-all', 'keys-2' and 'keys-any'.
 * However, it is allowed to use any string. If a predicate is undefined,
 * the default value used by Pact is 'keys-all'.
 * @alpha
 */
export type TPredicate = string | undefined;
