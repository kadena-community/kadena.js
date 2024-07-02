/* eslint @typescript-eslint/no-explicit-any: 0 */
import type { StyleRule } from '@vanilla-extract/css';
import { fallbackVar } from '@vanilla-extract/css';
import type { Properties } from 'csstype';
import get from 'lodash.get';
import omit from 'lodash.omit';
import { isNullOrUndefined } from '../utils/is';
import type { FlattenObject, ObjectPathLeaves } from '../utils/object';
import { flattenObject } from '../utils/object';
import { tokens } from './tokens/contract.css';

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

/**
 * @internal usage
 */
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

// eslint-disable-next-line
const ignoredTokens = ['@hover', '@focus', '@disabled'] as const;
type IgnoredToken = (typeof ignoredTokens)[number];

/**
 * @internal
 */
export function flattenTokens<T extends Record<string, Token>>(
  tokens: T,
): FlattenObject<T, IgnoredToken> {
  return flattenObject(tokens, ignoredTokens);
}

export type TokenPath = ObjectPathLeaves<typeof tokens.kda.foundation>;
export function token(path: TokenPath, fallback?: string): string {
  const v = get(tokens.kda.foundation, path);
  if (!isNullOrUndefined(fallback)) {
    return fallbackVar(v, fallback);
  }
  return v;
}
