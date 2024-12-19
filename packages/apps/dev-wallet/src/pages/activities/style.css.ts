import { style } from '@vanilla-extract/css';

export const hashStyle = style({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 70,
});

export const codeClass = style({
  whiteSpace: 'pre-wrap',
});
