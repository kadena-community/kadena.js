/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import { styled } from '../../styles/stitches.config';

export const sizeVariant = {
  sm: {
    width: '$sm',
    height: '$sm',
  },
  md: {
    width: '$lg',
    height: '$lg',
  },
  lg: {
    width: '$2xl',
    height: '$2xl',
  },
} as const;

export const IconContainer = styled('span', {
  display: 'flex',

  variants: {
    size: sizeVariant,
  },

  defaultVariants: {
    size: 'md',
  },
});
