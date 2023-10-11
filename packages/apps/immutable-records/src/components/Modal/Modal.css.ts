import { style } from '@vanilla-extract/css';

export const backdrop = style([
  {
    zIndex: 2,
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.5)',
  },
]);

export const container = style([
  {
    padding: 0,
    zIndex: 3,
    position: 'fixed',
    inset: '0',
    minWidth: '60vw',
    maxWidth: '80vw',
    margin: '10vh auto 0',
    color: '#fff',
    background: 'transparent',
    border: 'none',
    // scrollable if vertical height is less than content height
    maxHeight: '90vh',
    overflowY: 'auto',
  },
]);
