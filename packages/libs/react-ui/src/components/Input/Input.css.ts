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
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    paddingX: '$4',
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
