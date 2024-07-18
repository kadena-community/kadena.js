import { atoms } from '@kadena/kode-ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loaderWrapperClass = style([
  atoms({
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    inset: 0,
  }),
  {
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 2,
    color: 'black',
  },
]);

export const animateClass = style([
  {
    animationName: rotate,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
]);
