import { globalStyle, style } from '@vanilla-extract/css';

export const tableClass = style({
  width: '100%',
});

globalStyle(`${tableClass} td span`, {
  display: 'block',
  contain: 'inline-size',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
