/* eslint @typescript-eslint/naming-convention: 0 */
import { sprinkles } from '@theme/sprinkles.css';
import { breakpoints, mapToProperty, responsiveStyle } from '@theme/themeUtils';
import { style, styleVariants } from '@vanilla-extract/css';
import mapValues from 'lodash.mapvalues';

export const gridContainerClass = style([
  {
    display: 'grid',
  },
]);

export const gridItemClass = style([
  {
    gridColumnStart: 'auto',
  },
]);

export const gapVariants = styleVariants({
  $2xs: [sprinkles({ gridGap: '$2xs' })],
  $xs: [sprinkles({ gridGap: '$xs' })],
  $sm: [sprinkles({ gridGap: '$sm' })],
  $md: [sprinkles({ gridGap: '$md' })],
  $lg: [sprinkles({ gridGap: '$lg' })],
  $xl: [sprinkles({ gridGap: '$xl' })],
  $2xl: [sprinkles({ gridGap: '$2xl' })],
  $3xl: [sprinkles({ gridGap: '$3xl' })],
});

const columnCount: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
};

export const rowSpanVariants = styleVariants(columnCount, (count) =>
  mapToProperty('gridRow')(`span ${count}`),
);

export const containerColumnVariants = mapValues(breakpoints, (mediaQuery) => {
  return styleVariants(columnCount, (count) => {
    if (mediaQuery === '') {
      return [
        {
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        },
      ];
    }

    return [
      {
        '@media': {
          [mediaQuery]: {
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          },
        },
      },
    ];
  });
});

export const itemColumnVariants = mapValues(breakpoints, (mediaQuery) => {
  return styleVariants(columnCount, (count) => {
    if (mediaQuery === '') {
      return [
        {
          gridColumn: `span ${count}`,
        },
      ];
    }

    return [
      {
        '@media': {
          [mediaQuery]: {
            gridColumn: `span ${count}`,
          },
        },
      },
    ];
  });
});

export type ResponsiveInputType =
  | number
  | Partial<Record<keyof typeof breakpoints, keyof typeof columnCount>>;
