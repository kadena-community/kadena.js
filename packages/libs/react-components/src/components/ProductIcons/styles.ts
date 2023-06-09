import { styled } from '../../styles/stitches.config';

export const sizeVariant = {
  sm: {
    size: '$4',
  },
  md: {
    size: '$10',
  },
  lg: {
    size: '$24',
  },
} as const;

export const ProductIconContainer = styled('span', {
  display: 'flex',
  '> svg': {
    width: '100%',
  },

  variants: {
    size: sizeVariant,
  },

  defaultVariants: {
    size: 'md',
  },
});
