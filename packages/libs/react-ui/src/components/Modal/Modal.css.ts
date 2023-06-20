import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const background = style({
  position: 'fixed',
  backgroundColor: 'green',
  opacity: '.5',
  inset: 0,
  width: '100vw',
  height: '100vh',
});

export const wrapper = style({
  position: 'fixed',
  margin: '12.5vh 12.5vw',
  background: 'yellow',
  width: '75vw',
  height: '75vh',
});
