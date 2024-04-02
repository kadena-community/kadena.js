import { atoms, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const accountInputWrapperStyle = style([
  atoms({
    fontFamily: 'monospaceFont',
  }),
]);

globalStyle(`${accountInputWrapperStyle} > *:first-child`, {
  flex: 1,
});

globalStyle(`${accountInputWrapperStyle} > button`, {
  marginTop: tokens.kda.foundation.size.n8,
});
