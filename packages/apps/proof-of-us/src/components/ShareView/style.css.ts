import { deviceColors } from '@/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const qrClass = style({
  maxWidth: '400px',
  maxHeight: '400px',
  margin: '0 auto',
});
export const copyClass = style({
  marginLeft: '10px',
  fill: deviceColors.green,
});
