import { statusColor } from '@components/InputWrapper/InputWrapper.css';
import { sprinkles } from '@theme/sprinkles.css';
import { fallbackVar, style } from '@vanilla-extract/css';
import { darkThemeClass, vars } from '../../styles';

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
    position: 'relative',
  }),
  {
    borderBottom: `1px solid ${fallbackVar(statusColor, vars.colors.$gray30)}`,
    selectors: {
      [`.${darkThemeClass} &`]: {
        borderBottom: `1px solid ${fallbackVar(
          statusColor,
          vars.colors.$gray60,
        )}`,
      },
    },
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
      [`.${darkThemeClass} &`]: {
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
    appearance: 'none',
  },
]);

export const chevronIconClass = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: '$2',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '$1',
    color: '$gray40',
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
