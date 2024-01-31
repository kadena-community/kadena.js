import { style } from '@vanilla-extract/css';

export const canvasClass = style([
  {
    position: 'relative',
    width: '500px',
    aspectRatio: '1/1',
  },
]);

export const modalClass = style([
  {
    position: 'absolute',
    background: 'white',
    inset: 0,
  },
]);
