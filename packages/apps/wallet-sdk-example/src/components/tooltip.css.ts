import { style } from '@vanilla-extract/css';

export const tooltipContainer = style({
  position: 'relative',
  display: 'inline-block',
});

export const tooltipContent = style({
  backgroundColor: '#333',
  color: '#fff',
  padding: '8px',
  borderRadius: '4px',
  fontSize: '14px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  zIndex: 1000,
  maxWidth: '200px',
  textAlign: 'center',
  position: 'fixed',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s',
  selectors: {
    '&[data-show]': {
      opacity: 1,
      visibility: 'visible',
    },
  },
});
