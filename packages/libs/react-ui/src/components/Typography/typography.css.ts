import { sprinkles } from '../../styles';

import { ComplexStyleRule } from '@vanilla-extract/css';

export const fontVariants: Record<string | number, ComplexStyleRule> = {
  main: [sprinkles({ fontFamily: 'main' })],
  mono: [sprinkles({ fontFamily: 'mono' })],
};

export const transformVariants: Record<string | number, ComplexStyleRule> = {
  uppercase: [sprinkles({ textTransform: 'uppercase' })],
  lowercase: [sprinkles({ textTransform: 'lowercase' })],
  capitalize: [sprinkles({ textTransform: 'capitalize' })],
  none: [sprinkles({ textTransform: 'none' })],
};

export const colorVariants: Record<string | number, ComplexStyleRule> = {
  default: [sprinkles({ color: 'neutral4' })],
  emphasize: [sprinkles({ color: 'neutral6' })],
};
