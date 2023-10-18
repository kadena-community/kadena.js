import { vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';

export const accountInputWrapperStyle = style([
  {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
]);

globalStyle(`${accountInputWrapperStyle} > *:first-child`, {
  flex: 1,
});
globalStyle(`${accountInputWrapperStyle} > button`, {
  marginTop: vars.sizes.$8,
});
