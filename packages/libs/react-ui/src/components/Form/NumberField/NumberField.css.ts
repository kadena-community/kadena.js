import { styleVariants, token } from '../../../styles';

export const iconSize = styleVariants({
  sm: {
    fontSize: '11px',
  },
  md: {
    fontSize: '13px',
  },
  lg: {
    fontSize: token('size.n4'),
  },
});
