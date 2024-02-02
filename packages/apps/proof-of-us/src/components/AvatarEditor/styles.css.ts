import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  {
    position: 'absolute',
    background: 'white',
    inset: 0,
  },
]);

export const hiddenClass = style({
  display: 'none',
});

export const cameraClass = style({
  position: 'absolute',
  inset: 0,
  width: '100vw',
  height: '100vh',
  objectFit: 'cover',
});

export const cameraButton = style({
  position: 'absolute',
  zIndex: 1,
  bottom: '20px',
  borderRadius: '50%',
  border: 0,
  width: '10vw',
  aspectRatio: '1/1',
  cursor: 'pointer',
});

export const cameraWrapperClass = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
});
