import { globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  padding: 0,
  fontFamily: 'var(--font-body)',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text)',
  transition: 'background-color 0.3s, color 0.3s',
});
