/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import { styled } from '../../styles';

export const spacingVariant = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xs': {
    gridGap: '$2xs',
  },
  xs: {
    gridGap: '$xs',
  },
  sm: {
    gridGap: '$sm',
  },
  md: {
    gridGap: '$md',
  },
  lg: {
    gridGap: '$lg',
  },
  xl: {
    gridGap: '$xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xl': {
    gridGap: '$2xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3xl': {
    gridGap: '$3xl',
  },
} as const;

export const GridContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  defaultVariants: {
    gap: '$md',
  },
  variants: {
    gap: spacingVariant,
  },
});

export const GridItem = styled('div', {
  gridColumnStart: 'auto',
});
