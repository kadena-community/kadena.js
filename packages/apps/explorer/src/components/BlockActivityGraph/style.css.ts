import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const barClass = style([
  {
    position: 'absolute',
    left: 0,
    width: '8px',
    backgroundColor:
      tokens.kda.foundation.color.icon.brand.primary.inverse.default,
    transition: 'all 1s ease',
  },
]);
