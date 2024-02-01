import { style } from '@vanilla-extract/css';
import { responsiveStyles, token } from 'src/styles';
import { atoms } from '../../styles/atoms.css';

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
