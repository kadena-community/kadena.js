/* eslint @typescript-eslint/no-explicit-any: 0 */

type Token = string | { [key: string]: Token };
type IgnoredToken = '@hover' | '@focus' | '@disabled';

// eslint-disable-next-line
const ignoredTokens = ['@hover', '@focus', '@disabled'];

function isValue(token: Token): token is string {
  return typeof token === 'string';
}

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol | IgnoredToken>}${T[K] extends object
        ? `.${Leaves<T[K]>}`
        : ''}`;
    }[keyof T]
  : never;

type FlattenObjectTokens<T extends { [key: string]: Token }> = {
  [Key in Leaves<T>]: string;
};

/**
 * @private Used internally to create utility class options
 * @param {Record<string, any>} tokens - The tokens to flatten
 * @param {string | undefined} prefix - Do not use this parameter. This param is used to internally recursively pass parent prefixes to nested tokens.
 */
export const flattenTokens = <T extends Record<string, any>>(
  tokens: T,
  prefix?: string,
): FlattenObjectTokens<T> => {
  if (isValue(tokens)) {
    return { [prefix!]: tokens } as any;
  }

  const flattenedTokens: any = {};
  Object.keys(tokens).forEach((key) => {
    if (ignoredTokens.includes(key)) {
      return;
    }

    const newKey = prefix !== undefined ? prefix.concat('.', key) : key;
    const item = tokens[key];
    if (isValue(item)) {
      flattenedTokens[newKey] = item;
    } else {
      Object.assign(flattenedTokens, flattenTokens(item, newKey));
    }
  });
  return flattenedTokens;
};
