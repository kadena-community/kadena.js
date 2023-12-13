import { atoms } from '@theme/atoms.css';
import type { ComplexStyleRule } from '@vanilla-extract/css';

export const fontVariants = {
  main: [atoms({ fontFamily: 'primaryFont' })],
  mono: [atoms({ fontFamily: 'codeFont' })],
};

export const transformVariants = {
  uppercase: [atoms({ textTransform: 'uppercase' })],
  lowercase: [atoms({ textTransform: 'lowercase' })],
  capitalize: [atoms({ textTransform: 'capitalize' })],
  none: [atoms({ textTransform: 'none' })],
};

export const colorVariants = {
  default: [atoms({ color: 'text.subtlest.default' })],
  emphasize: [atoms({ color: 'text.base.default' })],
};
