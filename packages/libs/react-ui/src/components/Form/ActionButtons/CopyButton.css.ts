import { atoms } from '@theme/atoms.css';
import { colorPalette } from '@theme/colors';
import { darkThemeClass } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const buttonClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'md',
    cursor: 'pointer',
    border: 'none',
  }),
  {
    width: '32px',
    height: '32px',
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
