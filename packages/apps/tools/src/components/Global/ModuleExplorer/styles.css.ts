import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({ display: 'grid', height: '100%' }),
  {
    gridTemplateColumns: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n16}) 1fr`, // 20rem 1fr
  },
]);
