import { style } from '@vanilla-extract/css';

export const ticketClass = style({
  position: 'relative',
  width: '100vw',
  maxWidth: '800px',
  aspectRatio: '16/9',
  background: 'lightgrey',
  backgroundRepeat: 'none',
  backgroundSize: 'cover',
  borderRadius: '8px',
});
