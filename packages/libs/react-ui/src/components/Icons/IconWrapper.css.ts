import { sprinkles } from '../../styles';

import { styleVariants } from '@vanilla-extract/css';

export const sizeVariants = styleVariants({
  sm: [sprinkles({ size: '$4' })],
  md: [sprinkles({ size: '$6' })],
  lg: [sprinkles({ size: '$8' })],
  xl: [sprinkles({ size: '$10' })],
  heroHeader: [sprinkles({ size: '$24' })],
});
