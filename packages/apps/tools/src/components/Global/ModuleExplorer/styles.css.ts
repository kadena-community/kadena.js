import { atoms, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({ display: 'grid' }),
  {
    gridTemplateColumns: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n16}) 1fr`, // 20rem 1fr
  },
]);
