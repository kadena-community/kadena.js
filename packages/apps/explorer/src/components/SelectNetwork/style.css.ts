import { token, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const cardVisualClass = style({
  width: tokens.kda.foundation.size.n16,
  height: tokens.kda.foundation.size.n16,
  color: token('color.icon.brand.primary.default'),
});
