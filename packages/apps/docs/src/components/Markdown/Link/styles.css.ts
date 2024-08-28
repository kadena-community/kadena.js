import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const linkClass = style([
  atoms({
    color: 'text.brand.primary.default',
    fontWeight: 'secondaryFont.medium',
  }),
]);
