import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const disabledClass = style([
  sprinkles({
    pointerEvents: 'none',
    bg: {
      darkMode: '$gray60',
      lightMode: '$gray20',
    },
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$gray60,
      },
    },
  },
]);

export const textAreaContainerClass = style([
  sprinkles({
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    paddingX: '$4',
  }),
]);

export const textAreaClass = style([
  sprinkles({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '$foreground',
    outline: 'none',
    flexGrow: 1,
    paddingY: '$2',
  }),
  {
    minHeight: vars.sizes.$20,
    resize: 'none',
    '::placeholder': {
      color: vars.colors.$gray40,
    },
    [`${darkThemeClass} &::placeholder`]: {
      color: vars.colors.$gray50,
    },
  },
]);
