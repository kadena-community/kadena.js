import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const baseOutlinedClass = style([
  sprinkles({
    borderRadius: '$sm',
  }),
  {
    outline: `2px solid ${vars.colors.$gray30}`,
    outlineOffset: '2px',
    selectors: {
      [`${darkThemeClass} &`]: {
        outline: `2px solid ${vars.colors.$gray60}`,
      },
    },
  },
]);

export const baseContainerClass = style([
  sprinkles({
    alignItems: 'stretch',
    borderRadius: '$sm',
    display: 'flex',
    color: '$foreground',
    overflow: 'hidden',
    lineHeight: '$lg',
    boxShadow: '$1',
    bg: {
      lightMode: '$white',
      darkMode: '$gray100',
    },
  }),
  {
    position: 'relative',
    selectors: {
      [`${darkThemeClass} &`]: {
        boxShadow: '$2',
      },
      '&:focus-within': {
        outline: `2px solid ${vars.colors.$blue60}`,
        outlineOffset: '2px',
      },
    },
  },
]);
