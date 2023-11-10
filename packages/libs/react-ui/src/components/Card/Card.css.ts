import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray10',
      darkMode: '$gray90',
    },
    color: {
      lightMode: '$gray100',
      darkMode: '$gray20',
    },
    paddingX: '$10',
    paddingY: '$6',
    borderRadius: '$sm',
    marginY: '$6',
    border: 'none',
    width: 'max-content',
    position: 'relative',
  }),
  {
    border: `1px solid ${vars.colors.$gray30}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        border: `1px solid ${vars.colors.$gray60}`,
      },
    },
  },
]);

export const fullWidthClass = style({
  width: '100%',
});

export const disabledClass = style([
  sprinkles({
    pointerEvents: 'none',
  }),
  {
    opacity: 0.5,
  },
]);
