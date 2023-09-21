import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const blogitem = style([
  sprinkles({
    paddingBottom: '$8',
    marginTop: '$8',
    borderRadius: '$md',
    backgroundColor: 'transparent',
  }),
  {
    willChange: 'background-color',
    transition: 'background-color .2s ease',

    borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
    selectors: {
      '&:hover': {
        backgroundColor: vars.colors.$neutral2,
      },
    },
  },
]);

export const link = style([
  sprinkles({
    display: 'block',
    color: '$foreground',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        color: vars.colors.$neutral4,
      },
    },
  },
]);

export const footer = style([
  sprinkles({
    marginTop: '$3',
    color: '$neutral3',
  }),
]);

export const metaItem = style([
  sprinkles({}),
  {
    selectors: {
      '&:not(:last-child)::after': {
        content: '"•"',
        margin: `0 ${vars.sizes.$6}`,
      },
    },
  },
]);

export const tagLinkClass = style([
  sprinkles({
    marginRight: '$2',
  }),
]);

export const figureClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,

    position: 'relative',
    backgroundColor: '$neutral2',
    borderRadius: '$md',
  }),
  {
    width: `clamp(${vars.sizes.$32}, 15vw, ${vars.sizes.$48})`,
    aspectRatio: '1',
  },
]);

export const figureVariant = styleVariants({
  default: {
    width: `clamp(${vars.sizes.$32}, 15vw, ${vars.sizes.$48})`,
  },
  large: {
    width: `clamp(${vars.sizes.$48}, 20vw, ${vars.sizes.$64})`,
  },
});

export const imageClass = style([
  sprinkles({
    borderRadius: '$md',
  }),
]);

export const authorTitleClass = style([
  sprinkles({
    fontSize: '$md',
    fontWeight: '$normal',
    color: '$neutral3',
  }),
]);
