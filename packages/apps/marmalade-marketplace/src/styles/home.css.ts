// home.css.ts

import { token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const mainWrapperClass = style({
  display: 'grid',
  padding: '120px',
});

export const actionBarClass = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '40px',
  gap: '20px',
});

export const actionBarSaleClass = style({
  display: 'flex',
  gap: '20px',
});

export const actionBarSaleActiveClass = style({
  backgroundColor: token('color.background.accent.primary.inverse.@hover'),
});
