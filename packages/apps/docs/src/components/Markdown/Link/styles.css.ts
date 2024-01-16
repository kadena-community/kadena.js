import { atoms } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const linkClass = style([
  atoms({
    color: 'text.brand.primary.default',
    fontWeight: 'bodyFont.medium',
  }),
]);
