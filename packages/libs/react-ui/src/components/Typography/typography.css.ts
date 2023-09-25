import { sprinkles } from '../../styles';

import type { ComplexStyleRule } from '@vanilla-extract/css';

export const fontVariants: Record<string, ComplexStyleRule> = {
  main: [sprinkles({ fontFamily: '$main' })],
  mono: [sprinkles({ fontFamily: '$mono' })],
};

export const transformVariants: Record<string, ComplexStyleRule> = {
  uppercase: [sprinkles({ textTransform: 'uppercase' })],
  lowercase: [sprinkles({ textTransform: 'lowercase' })],
  capitalize: [sprinkles({ textTransform: 'capitalize' })],
  none: [sprinkles({ textTransform: 'none' })],
};

export const colorVariants: Record<string, ComplexStyleRule> = {
  default: [sprinkles({ color: '$neutral4' })],
  emphasize: [sprinkles({ color: '$neutral6' })],
};
