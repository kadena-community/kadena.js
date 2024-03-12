import { globalStyle, style } from '@vanilla-extract/css';

export const buttonClass = style({
  border: 0,
  background: 'transparent',
  color: 'white',
  cursor: 'pointer',
  padding: '10px',

  selectors: {
    '&:first-child': {
      paddingInlineStart: 0,
    },
    '&:last-child': {
      paddingInlineEnd: 0,
    },
  },
});

globalStyle(`${buttonClass} > svg`, {
  minWidth: '24px',
  aspectRatio: '1/1',
});
