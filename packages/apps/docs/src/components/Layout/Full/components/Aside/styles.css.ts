import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const asideItemLinkClass = style([
  sprinkles({
    textDecoration: 'none',
    fontSize: '$sm',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const asideItemLinkActiveVariants = styleVariants({
  true: {
    color: vars.colors.$neutral6,
  },
  false: {
    color: vars.colors.$neutral6,
    opacity: 0.6,
  },
});

export const asideItemClass = style([
  sprinkles({
    paddingY: '$1',
  }),
  {
    selectors: {
      '&::marker': {
        color: vars.colors.$primaryHighContrast,
        fontWeight: vars.fontWeights.$bold,
        display: 'inline-block',
        width: vars.sizes.$4,
        margin: `0 ${vars.sizes.$1}`,
      },
    },
  },
]);

export const asideListClass = style([
  sprinkles({
    margin: 0,
    padding: 0,
  }),
  {
    listStyle: 'initial',
    listStylePosition: 'outside',
  },
]);

export const asideListInnerVariants = styleVariants({
  true: {
    paddingLeft: vars.sizes.$6,
  },
  false: {},
});
