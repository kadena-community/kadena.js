import { style } from '@vanilla-extract/css';

export const background = style({
  position: 'fixed',
  backgroundColor: 'green',
  opacity: '.5',
  inset: 0,
  padding: 0,
  cursor: 'pointer',
  zIndex: 9998,
});

export const wrapper = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  zIndex: 9999,
});

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'initial',
});
