import { keyframes } from '@vanilla-extract/css';
import { style } from './../../../styles';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loaderClass = style([
  {
    animation: `${rotate} 2s infinite linear `,
  },
]);
