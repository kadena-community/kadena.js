import { keyframes, styled } from '@styles/stitches.config';

export const Container = styled('div', {
  borderRadius: '$md',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  m: '$1',

  // NOTE: Needs to be updated to be responsive
  height: '$blockWidth',
  width: '$blockWidth',
  border: '1px solid $mauve7',
});

const BlockEntrance = keyframes({
  '0%': {
    transform: 'scale(0)',
    animationTimingFunction: 'ease-in',
  },
  '70%': {
    transform: 'scale(1.1)',
    animationTimingFunction: 'ease-in',
  },
  '100%': {
    transform: 'scale(1)',
    animationTimingFunction: 'ease-out',
  },
});

export const Content = styled('div', {
  zIndex: 2,
  animation: `${BlockEntrance} 0.4s`,
  height: '$blockWidth',
  width: '$blockWidth',
  background: '$$color',
  borderRadius: '$md',
  display: 'flex',
  alignItems: 'center',
  px: '$2',
  py: '$1',
});
