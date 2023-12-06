import { atoms } from '@theme/atoms.css';
import type { ComplexStyleRule } from '@vanilla-extract/css';

export const fontVariants: Record<string, ComplexStyleRule> = {
  main: [atoms({ fontFamily: 'primaryFont' })],
  mono: [atoms({ fontFamily: 'codeFont' })],
};

export const transformVariants: Record<string, ComplexStyleRule> = {
  uppercase: [atoms({ textTransform: 'uppercase' })],
  lowercase: [atoms({ textTransform: 'lowercase' })],
  capitalize: [atoms({ textTransform: 'capitalize' })],
  none: [atoms({ textTransform: 'none' })],
};

export const colorVariants: Record<string, ComplexStyleRule> = {
  default: [atoms({ color: 'text.subtlest.default' })],
  emphasize: [atoms({ color: 'text.base.default' })],
};
