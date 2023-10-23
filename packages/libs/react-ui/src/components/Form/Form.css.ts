import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';
// use this in all our inputs

export const baseOutlinedClass = style([
  sprinkles({
    borderRadius: '$sm',
  }),
  // focus class
  {
    outline: `2px solid ${vars.colors.$gray30}`,
    outlineOffset: '1px',
    selectors: {
      [`${darkThemeClass} &`]: {
        outline: `2px solid ${vars.colors.$gray60}`,
      },
    },
  },
]);

// base container class
