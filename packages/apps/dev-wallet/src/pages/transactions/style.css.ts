import { style } from '@vanilla-extract/css';

export const hashStyle = style({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: 200,
});
