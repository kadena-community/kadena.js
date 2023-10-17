import { globalStyle, style } from '@vanilla-extract/css';

export const containerStyle = style({});

globalStyle(`${containerStyle} span`, { fontFamily: 'inherit !important' });
