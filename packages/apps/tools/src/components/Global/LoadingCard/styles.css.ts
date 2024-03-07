import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '10000',
  },
]);

export const loaderStyle = style([
  {
    margin: '0 auto',
  },
]);
