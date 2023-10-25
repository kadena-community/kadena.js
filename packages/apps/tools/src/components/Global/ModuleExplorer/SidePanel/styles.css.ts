import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  {
    display: 'flex',
    flexDirection: 'column',
    height: `calc(${vars.sizes.$64} * 3 + ${vars.sizes.$16})`, // 52rem
  },
]);

export const modulesContainerStyle = style([{ flex: 1, overflow: 'scroll' }]);

export const moduleTitle = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: `calc(${vars.sizes.$64} + ${vars.sizes.$8})`, // 2rem less than the width of the column
});

export const outlineStyle = style([
  sprinkles({
    height: '$64',
  }),
  {
    overflow: 'scroll',
  },
]);
