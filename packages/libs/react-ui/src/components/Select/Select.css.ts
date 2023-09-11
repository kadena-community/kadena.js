import { darkThemeClass, vars } from '../../styles';

import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    backgroundColor: {
      lightMode: '$white',
      darkMode: '$background',
    },
    borderColor: {
      lightMode: '$white',
      darkMode: '$gray60',
    },
    borderRadius: '$sm',
    color: '$foreground',
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    overflow: 'hidden',
    paddingLeft: '$4',
    paddingRight: '$2',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$gray30}`,
  },
]);

export const containerClassDisabled = style([
  sprinkles({
    pointerEvents: 'none',
    backgroundColor: {
      lightMode: '$gray20',
      darkMode: '$gray60',
    },
    color: {
      lightMode: '$foreground',
    },
  }),
  {
    opacity: 0.4,
    selectors: {
      '.inputGroup &': {
        opacity: 1,
      },
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$gray60, // NOTE: this is to override the normal bg color
      },
    },
  },
]);

export const iconClass = style([
  sprinkles({
    alignItems: 'center',
    display: 'flex',
  }),
]);

export const selectClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$foreground',
    flexGrow: 1,
    outline: 'none',
    paddingRight: '$2',
    paddingY: '$2',
  }),
  {
    backgroundColor: 'inherit',
    color: 'inherit',
  },
]);
