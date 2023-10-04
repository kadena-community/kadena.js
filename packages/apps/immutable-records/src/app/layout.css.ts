import { globalStyle, style } from '@vanilla-extract/css';

export const bodyClass = style([
  {
    margin: '0',
    background: '#1E1726',
    height: '100vh',
  },
]);

globalStyle('*', {
  boxSizing: 'border-box',
});
