import { sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const iconContainer = style([
  sprinkles({
    color: '$foreground',
  }),
]);

export const sizeVariants = styleVariants({
  sm: [iconContainer, sprinkles({ size: '$4' })],
  md: [iconContainer, sprinkles({ size: 6 })],
  lg: [iconContainer, sprinkles({ size: 8 })],
  xl: [iconContainer, sprinkles({ size: 10 })],
  heroHeader: [iconContainer, sprinkles({ size: 24 })],
});
