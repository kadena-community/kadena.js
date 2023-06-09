import { sprinkles } from '../../../styles';
import {
  boldVariants,
  colorVariants,
  fontVariants,
  transformVariants,
} from '../typography.css';

import { styleVariants } from '@vanilla-extract/css';

export const elementVariant = styleVariants({
  p: [sprinkles({ fontWeight: 'normal' })],
  span: [sprinkles({ fontWeight: 'normal' })],
  code: [sprinkles({ fontWeight: 'normal' })],
  label: [sprinkles({ fontWeight: 'medium' })],
});

export const textSizeVariant = styleVariants({
  sm: [sprinkles({ fontSize: 'xs' })],
  md: [sprinkles({ fontSize: 'sm' })],
  lg: [sprinkles({ fontSize: 'base' })],
});

export const fontVariant = styleVariants(fontVariants);
export const boldVariant = styleVariants(boldVariants);
export const transformVariant = styleVariants(transformVariants);
export const colorVariant = styleVariants(colorVariants);
