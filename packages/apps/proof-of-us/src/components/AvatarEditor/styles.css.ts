import { style } from '@vanilla-extract/css';

export const wrapperClass = style([{}]);

export const hiddenClass = style({
  display: 'none',
});

export const cameraClass = style({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  maxWidth: '800px',
  objectFit: 'cover',
});

export const cameraButton = style({
  position: 'absolute',
  zIndex: 1,
  bottom: '8vh',
  borderRadius: '50%',
  border: 0,
  width: '48px',
  aspectRatio: '1/1',
  cursor: 'pointer',
  backgroundColor: '#42CEA0',
  transform: 'translateX(-50%)',
  left: '50%',

  ':before': {
    position: 'absolute',
    content: '',
    border: '4px solid rgba(66, 206, 160, 0.5)',
    borderRadius: '50%',
    width: '73px',
    height: '73px',
    transform: 'translate(-50%, -50%)',
  },
});

export const cameraButtonWrapperClass = style({
  position: 'fixed',
  right: '50%',
  bottom: '2vh',
});

export const cameraWrapperClass = style({});
