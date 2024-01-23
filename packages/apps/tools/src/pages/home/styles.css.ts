import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const homeWrapperClass = style([
  {
    paddingInlineEnd: tokens.kda.foundation.size.n16,
  },
]);

export const helpCenterButtonClass = style([
  atoms({
    color: 'text.brand.primary.default',
    cursor: 'pointer',
  }),
]);
