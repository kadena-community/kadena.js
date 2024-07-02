import { tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const barClass = style([
  {
    width: '8px',
    backgroundColor:
      tokens.kda.foundation.color.icon.brand.primary.inverse.default,
    transition: 'all 1s ease',
  },
]);
