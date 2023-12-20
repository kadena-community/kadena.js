import { atoms } from '@theme/atoms.css';
import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';
import { baseContainerClass } from '../Form.css';

export const containerClass = style([
  baseContainerClass,
  atoms({
    backgroundColor: 'layer-3.default',
    gap: 'sm',
    paddingX: 'md',
  }),
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
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$gray60, // NOTE: this is to override the normal bg color
      },
    },
  },
]);

export const iconClass = style([
  atoms({
    alignItems: 'center',
    display: 'flex',
  }),
]);

export const selectClass = style([
  atoms({
    background: 'none',
    border: 'none',
    color: 'text.base.default',
    flexGrow: 1,
    outline: 'none',
    paddingRight: 'lg',
    paddingY: 'sm',
    fontSize: 'base',
  }),
  {
    backgroundColor: 'inherit',
    color: 'inherit',
    appearance: 'none',
  },
]);

export const chevronIconClass = style([
  atoms({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: 'sm',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    color: 'icon.base.default',
  }),
  {
    pointerEvents: 'none',
    zIndex: 10,
    selectors: {
      '&:active': {
        color: vars.colors.$gray40,
      },
    },
  },
]);
