import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  {
    position: 'absolute',
    background: 'white',
  },
]);

export const hiddenClass = style({
  display: 'none',
});

export const cameraClass = style({
  position: 'absolute',
  inset: 0,
  width: '100vw',
  maxWidth: '800px',
  height: '100vh',
  objectFit: 'cover',
});

export const cameraButton = style({
  position: 'absolute',
  zIndex: 1,
  top: '87vh',
  borderRadius: '50%',
  border: 0,
  width: '10vw',
  aspectRatio: '1/1',
  cursor: 'pointer',
});

export const cameraWrapperClass = style({
  position: 'absolute',
  top: 0,
  width: '100vw',
  maxWidth: '800px',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
});
