import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
  }),
  // {
  //   height: `calc(${tokens.kda.foundation.size.n64} * 3 + ${tokens.kda.foundation.size.n16})`, // 52rem
  // },
]);

export const modulesContainerStyle = style([
  atoms({ flex: 1, overflow: 'scroll' }),
]);

export const moduleTitle = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n8})`, // 2rem less than the width of the column
});

export const outlineStyle = style([
  {
    height: tokens.kda.foundation.size.n64,
    overflow: 'scroll',
  },
]);

export const headingStyles = style({
  flex: 1,
});
