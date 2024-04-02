import { deviceColors } from '@/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const listClass = style({
  listStyle: 'none',
  display: 'flex',
  padding: '0',
  justifyContent: 'space-around',
  alignItems: 'center',
});

export const copyClass = style({
  marginLeft: '10px',
  fill: deviceColors.green,
  width: '22px',
  height: '22px',
});
