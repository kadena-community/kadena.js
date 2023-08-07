import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

export const inputStatusColor = createVar();

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    display: 'flex',
    overflow: 'hidden',
    bg: {
      lightMode: '$white',
      darkMode: '$gray100',
    },
    color: '$foreground',
    borderRadius: '$sm',
  }),
  {
    borderBottom: `1px solid ${fallbackVar(
      inputStatusColor,
      vars.colors.$gray30,
    )}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid ${fallbackVar(
          inputStatusColor,
          vars.colors.$gray60,
        )}`,
      },
      '.inputGroup &': {
        borderRadius: 0,
      },
      '.inputGroup &:first-child': {
        borderTopRightRadius: vars.radii.$sm,
        borderTopLeftRadius: vars.radii.$sm,
      },
      '.inputGroup &:last-child': {
        borderBottomRightRadius: vars.radii.$sm,
        borderBottomLeftRadius: vars.radii.$sm,
      },
    },
  },
]);

export const inputContainerClass = style([
  sprinkles({
    alignItems: 'center',
    lineHeight: '$lg',
    display: 'flex',
    paddingX: '$4',
    paddingY: '$2',
    gap: '$2',
    flexGrow: 1,
  }),
]);

export const inputClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$foreground',
    outline: 'none',
    flexGrow: 1,
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
    minWidth: 0,
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
    backgroundColor: '$neutral2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
]);

export const leadingTextWidthVariant = styleVariants(vars.sizes, (size) => {
  return {
    width: size,
  };
});

export const outlinedClass = style([
  sprinkles({
    borderRadius: '$sm',
  }),
  {
    border: `1px solid ${vars.colors.$neutral3}`,
  },
]);
