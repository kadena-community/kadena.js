import { sprinkles } from '../../../styles';
import {
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';

import { style, styleVariants } from '@vanilla-extract/css';

export const elementVariant = styleVariants({
  p: [sprinkles({ fontWeight: '$normal' })],
  span: [sprinkles({ fontWeight: '$normal' })],
  code: [sprinkles({ fontWeight: '$normal' })],
});

export const sizeVariant = styleVariants({
  sm: [sprinkles({ fontSize: '$xs' })],
  md: [sprinkles({ fontSize: '$sm' })],
  lg: [sprinkles({ fontSize: '$base' })],
});

export const fontVariant = styleVariants(fontVariants);
export const transformVariant = styleVariants(transformVariants);
export const colorVariant = styleVariants(colorVariants);
export const boldClass = style([sprinkles({ fontWeight: '$semiBold' })]);
