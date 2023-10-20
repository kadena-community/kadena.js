import type { StyleRule } from '@vanilla-extract/css';
import type { Properties } from 'csstype';
import omit from 'lodash.omit';

// eslint-disable-next-line @kadena-dev/typedef-var
export const breakpoints = {
  xs: '',
  sm: `screen and (min-width: ${640 / 16}rem)`,
  md: `screen and (min-width: ${768 / 16}rem)`,
  lg: `screen and (min-width: ${1024 / 16}rem)`,
  xl: `screen and (min-width: ${1280 / 16}rem)`,
  xxl: `screen and (min-width: ${1536 / 16}rem)`,
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
