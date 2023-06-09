import { styled } from '../../styles/stitches.config';

export const sizeVariant = {
  sm: {
    size: '$sm',
  },
  md: {
    size: '$lg',
  },
  lg: {
    size: '$2xl',
  },
} as const;

export const IconContainer = styled('span', {
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
