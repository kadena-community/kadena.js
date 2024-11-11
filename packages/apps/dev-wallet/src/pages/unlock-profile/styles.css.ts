import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const passwordContainer = style([
  atoms({
    marginBlockStart: 'md',
  }),
  {
    minHeight: '100px',
  },
]);

export const profileContainer = style([
  atoms({
    marginBlockEnd: 'md',
  }),
]);
