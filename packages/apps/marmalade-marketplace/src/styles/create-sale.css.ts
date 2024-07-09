import { style } from '@vanilla-extract/css';
import { deviceColors } from './tokens.css';

export const container = style({
  margin: '0 15%',
  backgroundColor: deviceColors.background,
  borderRadius: '5px',
  border: `1px solid ${deviceColors.borderColor}`,
});

