import { sprinkles } from '../../styles';
import { breakpoints } from '../../styles/sprinkles.css';

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xs': [sprinkles({ gridGap: '$2xs' })],
  xs: [sprinkles({ gridGap: '$xs' })],
  sm: [sprinkles({ gridGap: '$sm' })],
  md: [sprinkles({ gridGap: '$md' })],
  lg: [sprinkles({ gridGap: '$lg' })],
  xl: [sprinkles({ gridGap: '$xl' })],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xl': [sprinkles({ gridGap: '$2xl' })],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3xl': [sprinkles({ gridGap: '$3xl' })],
});

export const rowSpanVariants = styleVariants({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: [{ gridRow: 'span 1' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  2: [{ gridRow: 'span 2' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  3: [{ gridRow: 'span 3' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  4: [{ gridRow: 'span 4' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  5: [{ gridRow: 'span 5' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  6: [{ gridRow: 'span 6' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  7: [{ gridRow: 'span 7' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  8: [{ gridRow: 'span 8' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  9: [{ gridRow: 'span 9' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  10: [{ gridRow: 'span 10' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  11: [{ gridRow: 'span 11' }],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  12: [{ gridRow: 'span 12' }],
});

const columnCount: Record<number, number> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: 1,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  2: 2,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  3: 3,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  4: 4,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  5: 5,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  6: 6,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  7: 7,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  8: 8,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  9: 9,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  10: 10,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  11: 11,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  12: 12,
};

const containerColumnVariantsArray = Object.keys(breakpoints).map((key) => {
  return styleVariants(columnCount, (count) => {
    return [
      {
        '@media': {
          [breakpoints[key]]: {
            gridTemplateColumns: `repeat(${count}, 1fr)`,
          },
        },
      },
    ];
  });
});

export const explicitColumnVariant = styleVariants(columnCount, (count) => {
  return [
    {
      gridTemplateColumns: `repeat(${count}, 1fr)`,
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
