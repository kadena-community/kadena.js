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
  width: '100vw',
  maxWidth: '800px',
  aspectRatio: '1/1',
  objectFit: 'cover',
});

export const cameraButton = style({
  position: 'absolute',
  zIndex: 1,
  bottom: '2vh',
  borderRadius: '50%',
  border: 0,
  width: 'clamp(50px, 10vw, 100px)',
  aspectRatio: '1/1',
  cursor: 'pointer',
});
export const cameraButtonWrapperClass = style({
  position: 'fixed',
  right: '50%',
  bottom: '2vh',
});

export const cameraWrapperClass = style({
  position: 'absolute',
  top: 0,
  width: '100vw',
  maxWidth: '800px',
  aspectRatio: '1/1',
  display: 'flex',
  justifyContent: 'center',
});
