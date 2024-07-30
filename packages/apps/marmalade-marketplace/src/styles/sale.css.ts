// styles.css.ts

import { deviceColors } from '@/styles/tokens.css';
import {  style } from '@vanilla-extract/css';



export const twoColumnRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '30px',
});

export const oneColumnRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
});

export const tokenImageClass = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '16px',
});

export const tokenInfoClass = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

export const tokenDetailsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const tokenDetailsInnerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const bidClass = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '4px',
  maxWidth: '400px',
});
