import { isObject, isString } from './is';

export type ObjectPathLeaves<T, Ignored = never> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol | Ignored>}${T[K] extends object
        ? `.${ObjectPathLeaves<T[K], Ignored>}`
        : ''}`;
    }[keyof T]
  : never;

export type FlattenObject<T extends object, Ignored = never> = {
  [Key in ObjectPathLeaves<T, Ignored>]: string;
};

type FlattenObjectTokens = Record<string, unknown>;

/**
 * Flattens an object to a single level object with dot notation
 * @param {Record<string, unknown>} tokens - The tokens to flatten
 * @param {string[]} ignoredPaths - The paths to ignore
 */
export function flattenObject<T extends FlattenObjectTokens, Ignored = never>(
  tokens: T,
  ignoredPaths: readonly string[] = [],
): FlattenObject<T, Ignored> {
  return flattenObjectHelper<T, Ignored>(tokens, ignoredPaths);
}

function flattenObjectHelper<T extends FlattenObjectTokens, Ignored = never>(
  tokens: FlattenObjectTokens,
  ignoredPaths: readonly string[] = [],
  prefix?: string,
): FlattenObject<T, Ignored> {
  if (isString(tokens)) {
    return { [prefix!]: tokens } as unknown as FlattenObject<T, Ignored>;
  }
  const flattenedTokens = {} as unknown as FlattenObject<T, Ignored>;
  for (const key in tokens) {
    if (ignoredPaths.includes(key)) {
      continue;
    }
    const newKey = prefix !== undefined ? prefix.concat('.', key) : key;
    const item = tokens[key];
    if (isObject(item)) {
      Object.assign(
        flattenedTokens,
        flattenObjectHelper(item, ignoredPaths, newKey),
      );
    } else {
      (flattenedTokens as FlattenObjectTokens)[newKey] = item;
    }
  }
  return flattenedTokens;
}
