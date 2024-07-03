import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const blockInfoClass = style([
  atoms({
    backgroundColor: 'layer.default',
    padding: 'md',
  }),
  {
    borderEndEndRadius: tokens.kda.foundation.radius.sm,
    borderEndStartRadius: tokens.kda.foundation.radius.sm,
  },
]);
