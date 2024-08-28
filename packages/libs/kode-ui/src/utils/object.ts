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

/**
 * Flattens an object to a single level object with dot notation
 * @param {Record<string, any>} tokens - The tokens to flatten
 * @param {string[]} ignoredPaths - The paths to ignore
 */
export function flattenObject<
  T extends Record<string, unknown>,
  Ignored = never,
>(tokens: T, ignoredPaths: readonly string[] = []): FlattenObject<T, Ignored> {
  return flattenObjectHelper(tokens, ignoredPaths);
}

function flattenObjectHelper(
  tokens: Record<string, unknown>,
  ignoredPaths: readonly string[] = [],
  prefix?: string,
) {
  if (isString(tokens)) {
    return { [prefix!]: tokens } as any;
  }
  const flattenedTokens: any = {};
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
      flattenedTokens[newKey] = item;
    }
  }
  return flattenedTokens;
}
