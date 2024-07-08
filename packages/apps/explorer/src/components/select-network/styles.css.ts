import { globalStyle, style } from '@vanilla-extract/css';

export const selectWrapperClass = style({});

globalStyle(`${selectWrapperClass} ~ ul`, {
  background: 'green!important',
});
