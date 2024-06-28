import { atoms, tokens } from '@kadena/react-ui/styles';
import { createVar, style } from '@vanilla-extract/css';

export const headerClass = style([
  atoms({
    padding: 'sm',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.background.layer.default,
    borderEndStartRadius: tokens.kda.foundation.radius.md,
    borderEndEndRadius: tokens.kda.foundation.radius.md,
  },
]);
