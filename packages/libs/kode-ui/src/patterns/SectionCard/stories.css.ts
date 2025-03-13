import { globalStyle } from '@vanilla-extract/css';
import { style } from './../../styles';

export const CardWrapperMinHeightClass = style({});

globalStyle(`${CardWrapperMinHeightClass} [class^="Card"]`, {
  minHeight: '500px',
});
