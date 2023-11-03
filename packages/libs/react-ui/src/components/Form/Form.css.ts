import { colorPalette } from '@theme/colors';
import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export type FormFieldStatus = 'disabled' | 'positive' | 'warning' | 'negative';
export const statusColor = createVar();
export const statusOutlineColor = createVar();

export const baseOutlinedClass = style([
  {
    outline: `2px solid ${fallbackVar(statusColor, vars.colors.$gray30)}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        outline: `2px solid ${fallbackVar(statusColor, vars.colors.$gray60)}`,
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
    bg: {
      lightMode: '$white',
      darkMode: '$gray100',
    },
  }),
  {
    position: 'relative',
    boxShadow: `0px 1px 0 0 ${colorPalette.$gray30}`,
    outlineOffset: '2px',
    selectors: {
      [`${darkThemeClass} &`]: {
        boxShadow: `0px 1px 0 0 ${colorPalette.$gray60}`,
      },
      '&:focus-within': {
        outline: `2px solid ${fallbackVar(statusColor, vars.colors.$blue60)}`,
        outlineOffset: '2px',
      },
    },
  },
]);
