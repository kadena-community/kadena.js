import { deviceColors } from '@/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const animateClass = style([
  {
    animationName: rotate,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
]);

export const checkClass = style([
  {
    color: deviceColors.green,
  },
]);
