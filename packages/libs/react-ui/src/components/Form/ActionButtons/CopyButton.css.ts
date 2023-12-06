import { colorPalette } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const buttonClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$md',
    cursor: 'pointer',
    border: 'none',
    width: '$8',
    height: '$8',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: `${colorPalette.$gray80}`,
        color: `${colorPalette.$gray30}`,
      },
      [`${darkThemeClass} &:hover`]: {
        backgroundColor: `${colorPalette.$gray20}`,
        color: `${colorPalette.$gray100}`,
      },
      [`&:hover`]: {
        backgroundColor: `${colorPalette.$gray80}`,
        color: `${colorPalette.$gray20}`,
      },
    },
    ':disabled': {
      opacity: 0.7,
      backgroundColor: colorPalette.$gray60,
      color: colorPalette.$gray10,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
]);
