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

export type breakpointOptions = 'xs' | keyof typeof breakpoints;
export type ResponsiveVariant = Record<
  breakpointOptions,
  Record<number, string>
>;

const breakpointsArray = [
  'xs',
  ...Object.keys(breakpoints),
] as breakpointOptions[];

const containerColumnVariantsArray = breakpointsArray.map((key) => {
  return styleVariants(columnCount, (count) => {
    if (key === 'xs') {
      return [
        {
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        },
      ];
    }

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

export const containerColumnVariants: ResponsiveVariant =
  breakpointsArray.reduce((acc, key, index) => {
    acc[key] = containerColumnVariantsArray[index];
    return acc;
  }, {} as ResponsiveVariant);

const itemColumnVariantsArray = breakpointsArray.map((key) => {
  return styleVariants(columnCount, (count) => {
    if (key === 'xs') {
      return [
        {
          gridColumn: `span ${count}`,
        },
      ];
    }

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

export const itemColumnVariants: ResponsiveVariant = breakpointsArray.reduce(
  (acc, key, index) => {
    acc[key] = itemColumnVariantsArray[index];
    return acc;
  },
  {} as ResponsiveVariant,
);

export type ResponsiveInputType =
  | number
  | Record<breakpointOptions, keyof typeof columnCount>;
