import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const background = style({
  position: 'fixed',
  backgroundColor: 'green',
  opacity: '.5',
  inset: 0,
  padding: 0,
  cursor: 'pointer',
});

export const wrapper = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
});

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'initial',
});
