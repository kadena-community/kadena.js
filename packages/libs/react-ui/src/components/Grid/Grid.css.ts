import { vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const gridContainerClass = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
  },
]);

export const gridItemClass = style([
  {
    gridColumnStart: 'auto',
  },
]);

export const gapVariants = styleVariants(
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2xs': '2xs',
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2xl': '2xl',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3xl': '3xl',
  } as Record<string, keyof typeof vars.sizes>,
  (gap) => {
    return [
      gridContainerClass,
      {
        gridGap: vars.sizes[gap],
      },
    ];
  },
);
