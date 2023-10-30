import { style } from '@vanilla-extract/css';

export const underlayClass = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  cursor: 'pointer',
  inset: 0,
  // TODO: use the correct alpha color from the new design tokens
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});
