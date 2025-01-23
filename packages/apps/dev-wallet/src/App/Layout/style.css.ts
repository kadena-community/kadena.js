import { createVar, style } from '@vanilla-extract/css';

const contentWidth = createVar();

export const isNotExpandedClass = style({
  vars: {
    [contentWidth]: 'calc(100vw - 45px)',
  },
});

export const isExpandedMainClass = style({
  vars: {
    [contentWidth]: 'min(1200px, calc(100vw - 232px))',
  },
});

export const mainContainerClass = style({
  display: 'flex',
  padding: '0 10px',
  flexDirection: 'column',
  maxWidth: '100vw',
  width: '100%',
  minHeight: 'calc(100vh - 120px)',
  '@media': {
    'screen and (min-width: 768px)': {
      maxWidth: contentWidth,
      minHeight: 'calc(100vh - 60px)',
    },
  },
});

export const mobileNetworkClass = style({
  display: 'flex',
  '@media': {
    'screen and (min-width: 640px)': {
      display: 'none',
    },
  },
});
