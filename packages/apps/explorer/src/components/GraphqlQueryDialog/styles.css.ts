import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const code = style([
  atoms({
    whiteSpace: 'break-spaces',
    fontFamily: 'monospaceFont',
    // display: 'none',
    position: 'relative',
  }),
  {
    padding: tokens.kda.foundation.size.n3,
    fontSize: tokens.kda.foundation.size.n3,
    counterReset: 'line',
    backgroundColor: tokens.kda.foundation.color.background.input.default,
  },
]);
