import { style } from '@vanilla-extract/css';

export const stickyHeader = style({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
});
