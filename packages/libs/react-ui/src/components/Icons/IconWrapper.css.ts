import { sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const iconContainer = style([
  sprinkles({
    color: 'foreground',
  }),
]);

export const sizeVariants = styleVariants({
  sm: [iconContainer, sprinkles({ size: 'sm' })],
  md: [iconContainer, sprinkles({ size: 'lg' })],
  lg: [iconContainer, sprinkles({ size: '2xl' })],
});
