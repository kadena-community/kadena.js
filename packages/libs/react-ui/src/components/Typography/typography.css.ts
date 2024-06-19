import { style } from '../../styles';

export const transformVariants = {
  uppercase: style({ textTransform: 'uppercase' }),
  lowercase: style({ textTransform: 'lowercase' }),
  capitalize: style({ textTransform: 'capitalize' }),
  none: style({ textTransform: 'none' }),
};

export const colorVariants = {
  default: style({ color: 'text.subtlest.default' }),
  emphasize: style({ color: 'text.base.default' }),
};
