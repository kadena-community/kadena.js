import { atoms, token, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const cardVisualClass = style({
  width: tokens.kda.foundation.size.n16,
  height: tokens.kda.foundation.size.n16,
  color: token('color.icon.brand.primary.default'),
});

export const selectBoxClass = style([
  atoms({
    position: 'absolute',
  }),
  {
    width: '50%',
    right: 0,
    top: '-8px',
  },
]);
