import { createGlobalTheme } from '@vanilla-extract/css';

export const deviceColors = {
  kadenaBlack: '#020E1B',
  kadenaFont: 'white',
  purple: '#893DE7',
  pink: '#C82269',
  red: '#D31510',
  orange: '#FFC700',
  darkGreen: '#577400',
  blue: '#0265DC',
  violet: '#5258E4',
  lightPurple: '#ACAFFF',
  lightBlue: '#96CEFD',
  green: '#27BB36',
  yellow: '#E8C600',
  salmon: '#FFB7A9',
  skin: '#FFB2CE',
  lightViolet: '#DBBBFE',
  borderColor: 'rgba(255,255,255, .2)',
  backgroundTransparentColor: 'rgba(255,255,255, 0.05)',
};

export const customTokens = createGlobalTheme(':root', {
  color: {
    accent: '#42CEA0',
    surface: 'rgba(147, 147, 147, 0.10)',
    forgroundSurface: 'rgba(147, 147, 147, 0.30)',
    border: 'white',
    buttonText: 'rgba(255, 255, 255, 0.60)',
    device: deviceColors,
  },
});
