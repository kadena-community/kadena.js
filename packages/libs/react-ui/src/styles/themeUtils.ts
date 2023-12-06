/* eslint @typescript-eslint/no-explicit-any: 0 */
import type { StyleRule } from '@vanilla-extract/css';
import type { Properties } from 'csstype';
import omit from 'lodash.omit';

// eslint-disable-next-line @kadena-dev/typedef-var
export const breakpoints = {
  xs: '',
  sm: 'screen and (min-width: 40rem)',
  md: 'screen and (min-width: 48rem)',
  lg: 'screen and (min-width: 64rem)',
  xl: 'screen and (min-width: 80rem)',
  xxl: 'screen and (min-width: 96rem)',
};

export type Breakpoint = keyof typeof breakpoints;
type CSSProps = Omit<StyleRule, '@media' | '@supports'>;

const makeMediaQuery =
  (
    breakpoint: Breakpoint,
  ): ((styles: CSSProps) => {
    [x: string]: CSSProps;
  }) =>
  (styles: CSSProps) =>
    Object.keys(styles).length === 0
      ? {}
      : {
          [breakpoints[breakpoint] as string]: styles,
        };

// eslint-disable-next-line @kadena-dev/typedef-var
const mediaQuery = {
  sm: makeMediaQuery('sm'),
  md: makeMediaQuery('md'),
  lg: makeMediaQuery('lg'),
  xl: makeMediaQuery('xl'),
  xxl: makeMediaQuery('xxl'),
} as const;

export const responsiveStyle = ({
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}: Partial<Record<Breakpoint, CSSProps>>): StyleRule => ({
  ...omit(xs, '@media'),
  ...(sm || md || lg || xl || xxl
    ? {
        '@media': {
          ...mediaQuery.sm(sm ?? {}),
          ...mediaQuery.md(md ?? {}),
          ...mediaQuery.lg(lg ?? {}),
          ...mediaQuery.xl(xl ?? {}),
          ...mediaQuery.xxl(xxl ?? {}),
        },
      }
    : {}),
});

export const mapToProperty =
  <Property extends keyof Properties<string | number>>(
    property: Property,
    breakpoint?: Breakpoint,
  ): ((value: string | number) => StyleRule) =>
  (value: string | number) => {
    const styleRule = { [property]: value };

    return breakpoint
      ? responsiveStyle({ [breakpoint]: styleRule })
      : styleRule;
  };

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
