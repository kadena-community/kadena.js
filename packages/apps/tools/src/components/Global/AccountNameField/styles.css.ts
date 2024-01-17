import { atoms, tokens } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';

export const accountInputWrapperStyle = style([
  atoms({
    fontFamily: 'codeFont',
  }),
]);

globalStyle(`${accountInputWrapperStyle} > *:first-child`, {
  flex: 1,
});

globalStyle(`${accountInputWrapperStyle} > button`, {
  marginTop: tokens.kda.foundation.size.n8,
});
