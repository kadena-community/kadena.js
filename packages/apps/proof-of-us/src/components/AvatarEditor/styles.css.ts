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
  bottom: '15vh',
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

export const cameraWrapperClass = style({
  position: 'relative',
  overflow: 'hidden',

  ':before': {
    content: '',
    display: 'block',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    background: 'rgba(0, 0, 0, 0.60)',
  },

  ':after': {
    content: '',
    display: 'block',
    width: '100%',
    height: '100%',
    top: '0',
    position: 'absolute',
    background:
      'linear-gradient(359deg, #020E1B 3.84%, rgba(2, 14, 27, 0.00) 88.76%)',
  },
});

export const canvasClass = style({
  position: 'absolute',
  width: '94vw',
  height: '94vw',
  maxWidth: '780px',
  transform: 'translateX(-50%)',
  left: '50%',
  top: '100px',
  zIndex: '1',
  border: '2px solid rgba(255, 255, 255, 0.40)',
  borderRadius: '8px',
  boxSizing: 'border-box',
});

export const headerClass = style({
  position: 'absolute',
  width: '90vw',
  zIndex: '2',
  left: '50%',
  transform: 'translate(-50%)',
});
