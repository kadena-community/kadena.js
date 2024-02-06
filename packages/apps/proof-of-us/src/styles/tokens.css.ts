import { createGlobalTheme } from '@vanilla-extract/css';

export const deviceColors = {
  purple: '#893DE7',
  pink: '#C82269',
  red: '#D31510',
  orange: '#856600',
  darkGreen: '#577400',
  blue: '#0265DC',
  violet: '#5258E4',
  lightPurple: '#ACAFFF',
  lightBlue: '#96CEFD',
  green: '#AAD816',
  yellow: '#E8C600',
  salmon: '#FFB7A9',
  skin: '#FFB2CE',
  lightViolet: '#DBBBFE',
};

export const customTokens = createGlobalTheme(':root', {
  color: {
    accent: '#58BD9C',
    surface: 'rgba(147, 147, 147, 0.10)',
    forgroundSurface: 'rgba(147, 147, 147, 0.30)',
    border: 'white',
    buttonText: 'rgba(255, 255, 255, 0.60)',
    device: deviceColors,
  },
});
