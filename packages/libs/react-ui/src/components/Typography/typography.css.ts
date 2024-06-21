import { style, token } from '../../styles';

export const transformVariants = {
  uppercase: style({ textTransform: 'uppercase' }),
  lowercase: style({ textTransform: 'lowercase' }),
  capitalize: style({ textTransform: 'capitalize' }),
  none: style({ textTransform: 'none' }),
};

export const colorVariants = {
  default: style({ color: token('color.text.subtlest.default') }),
  emphasize: style({ color: token('color.text.base.default') }),
};
