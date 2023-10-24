import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const baseOutlinedClass = style([
  sprinkles({
    borderRadius: '$sm',
  }),
  {
    outline: `2px solid ${vars.colors.$gray30}`,
    outlineOffset: '1px',
    selectors: {
      [`${darkThemeClass} &`]: {
        outline: `2px solid ${vars.colors.$gray60}`,
      },
      '&:focus-within': {
        outlineColor: vars.colors.$blue60,
      },
    },
  },
]);

// base container class
