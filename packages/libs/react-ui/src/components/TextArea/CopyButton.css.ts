import { colorPalette } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const copyButtonClass = style([
  sprinkles({
    position: 'absolute',
    top: '$2',
    right: '$2',
    fontSize: '$base',
    border: 'none',
    padding: '$1',
    cursor: 'pointer',
    borderRadius: '$md',
    backgroundColor: '$gray20',
  }),
  {
    ':hover': {
      color: colorPalette.$gray40,
    },
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: colorPalette.$gray90,
      },
      [`${darkThemeClass} &:hover`]: {
        backgroundColor: colorPalette.$gray60,
      },
    },
  },
]);
