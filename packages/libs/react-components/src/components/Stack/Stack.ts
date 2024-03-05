/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import type { VariantProps } from '@stitches/react';
import { styled } from '../../styles/stitches.config';

export interface IStackProps {
  gap?: VariantProps<typeof Stack>['gap'];
  direction?: VariantProps<typeof Stack>['direction'];
  flexWrap?: VariantProps<typeof Stack>['flexWrap'];
  alignItems?: VariantProps<typeof Stack>['alignItems'];
  justifyContent?: VariantProps<typeof Stack>['justifyContent'];
  children: React.ReactNode;
}

export const spacingVariant = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xs': {
    gap: '$2xs',
  },
  xs: {
    gap: '$xs',
  },
  sm: {
    gap: '$3',
  },
  md: {
    gap: '$md',
  },
  lg: {
    gap: '$lg',
  },
  xl: {
    gap: '$xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xl': {
    gap: '$2xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3xl': {
    gap: '$3xl',
  },
} as const;

export const justifyContentVariant = {
  'flex-start': {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  'flex-end': {
    justifyContent: 'flex-end',
  },
  'space-between': {
    justifyContent: 'space-between',
  },
  'space-around': {
    justifyContent: 'space-around',
  },
} as const;

export const alignItemsVariant = {
  'flex-start': {
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  'flex-end': {
    alignItems: 'flex-end',
  },
  stretch: {
    alignItems: 'stretch',
  },
} as const;

export const flexWrapVariant = {
  wrap: {
    flexWrap: 'wrap',
  },
  nowrap: {
    flexWrap: 'nowrap',
  },
} as const;

export const directionVariant = {
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
} as const;

export const Stack = styled('div', {
  display: 'flex',

  variants: {
    direction: directionVariant,
    justifyContent: justifyContentVariant,
    alignItems: alignItemsVariant,
    flexWrap: flexWrapVariant,
    gap: spacingVariant,
  },

  defaultVariants: {
    gap: 'md',
    direction: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  },
});
