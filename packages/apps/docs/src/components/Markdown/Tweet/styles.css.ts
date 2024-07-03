import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    borderBottom: `1px solid ${tokens.kda.foundation.color.border.base.default}`,
  },
]);
