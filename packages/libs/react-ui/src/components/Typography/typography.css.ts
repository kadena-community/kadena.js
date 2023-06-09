import { sprinkles } from '../../styles';

export const fontVariants = {
  main: [sprinkles({ fontFamily: 'main' })],
  mono: [sprinkles({ fontFamily: 'mono' })],
};

export const transformVariants = {
  uppercase: [sprinkles({ textTransform: 'uppercase' })],
  lowercase: [sprinkles({ textTransform: 'lowercase' })],
  capitalize: [sprinkles({ textTransform: 'capitalize' })],
  none: [sprinkles({ textTransform: 'none' })],
};

export const colorVariants = {
  default: [sprinkles({ color: 'neutral4' })],
  emphasize: [sprinkles({ color: 'neutral6' })],
};
