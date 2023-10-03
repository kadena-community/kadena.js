/* eslint @typescript-eslint/naming-convention: 0 */
import { breakpoints, sprinkles } from '@theme/sprinkles.css';
import { style, styleVariants } from '@vanilla-extract/css';

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

export const rowSpanVariants = styleVariants({
  1: [{ gridRow: 'span 1' }],
  2: [{ gridRow: 'span 2' }],
  3: [{ gridRow: 'span 3' }],
  4: [{ gridRow: 'span 4' }],
  5: [{ gridRow: 'span 5' }],
  6: [{ gridRow: 'span 6' }],
  7: [{ gridRow: 'span 7' }],
  8: [{ gridRow: 'span 8' }],
  9: [{ gridRow: 'span 9' }],
  10: [{ gridRow: 'span 10' }],
  11: [{ gridRow: 'span 11' }],
  12: [{ gridRow: 'span 12' }],
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

const containerColumnVariantsArray = Object.keys(breakpoints).map((key) => {
  return styleVariants(columnCount, (count) => {
    return [
      {
        '@media': {
          [breakpoints[key]]: {
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          },
        },
      },
    ];
  });
});

export const explicitColumnVariant = styleVariants(columnCount, (count) => {
  return [
    {
      gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
    },
  ];
});

export type ResponsiveVariant = Record<string, Record<number, string>>;

export const containerColumnVariants: ResponsiveVariant = {
  sm: containerColumnVariantsArray[0],
  md: containerColumnVariantsArray[1],
  lg: containerColumnVariantsArray[2],
  xl: containerColumnVariantsArray[3],
  xxl: containerColumnVariantsArray[4],
};

const itemColumnVariantsArray = Object.keys(breakpoints).map((key) => {
  return styleVariants(columnCount, (count) => {
    return [
      {
        '@media': {
          [breakpoints[key]]: {
            gridColumn: `span ${count}`,
          },
        },
      },
    ];
  });
});

export const explicitItemColumnVariant = styleVariants(columnCount, (count) => {
  return [
    {
      gridColumn: `span ${count}`,
    },
  ];
});

export const itemColumnVariants: ResponsiveVariant = {
  sm: itemColumnVariantsArray[0],
  md: itemColumnVariantsArray[1],
  lg: itemColumnVariantsArray[2],
  xl: itemColumnVariantsArray[3],
  xxl: itemColumnVariantsArray[4],
};

export type ResponsiveInputType =
  | number
  | Record<keyof typeof breakpoints, keyof typeof columnCount>;
