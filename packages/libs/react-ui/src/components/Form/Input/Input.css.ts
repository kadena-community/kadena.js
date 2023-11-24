import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

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
        backgroundColor: vars.colors.$gray60, // NOTE: this is to override the normal bg color
      },
    },
  },
]);

export const inputContainerClass = style([
  sprinkles({
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    paddingLeft: '$4',
    paddingRight: '$2',
  }),
]);

export const inputClass = style([
  sprinkles({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '$foreground',
    outline: 'none',
    flexGrow: 1,
    paddingY: '$2',
    fontSize: '$base',
  }),
  {
    '::placeholder': {
      color: vars.colors.$gray40,
    },
    [`${darkThemeClass} &::placeholder`]: {
      color: vars.colors.$gray50,
    },
  },
]);

export const leadingTextClass = style([
  sprinkles({
    overflow: 'hidden',
    display: 'inline-block',
    alignItems: 'center',
    paddingX: '$4',
  }),
  {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
]);

export const leadingTextWrapperClass = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray20',
      darkMode: '$gray60',
    },
    display: 'flex',
    alignItems: 'center',
  }),
]);

export const inputChildrenClass = style([
  {
    marginRight: '-0.5rem',
    paddingTop: '0.125rem',
    paddingBottom: '0.125rem',
    paddingRight: '0.125rem',
  },
]);

export const leadingTextWidthVariant = styleVariants(vars.sizes, (size) => {
  return {
    width: size,
  };
});
