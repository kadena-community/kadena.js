import { sprinkles } from '../../styles';

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
