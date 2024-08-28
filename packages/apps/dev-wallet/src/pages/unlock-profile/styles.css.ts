import { style } from '@vanilla-extract/css';
import { tokens, atoms } from '@kadena/kode-ui/styles';

export const passwordContainer = style([
  atoms({
    marginBlockStart: 'md',
  }),
  {
    minHeight: '100px'
  },
]);

export const profileContainer = style([
  atoms({
    marginBlockEnd: 'md',
  }),
  {
    border: `1px solid ${tokens.kda.foundation.color.neutral.n20}`,
  },
]);
