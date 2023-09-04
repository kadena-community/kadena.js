import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const asideItemLinkClass = style([
  sprinkles({
    textDecoration: 'none',
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
    textDecoration: 'underline',
  },
  false: {
    color: vars.colors.$primaryHighContrast,
  },
});

export const asideItemClass = style([
  sprinkles({
    lineHeight: '$base',
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
    paddingLeft: vars.sizes.$4,
  },
  false: {},
});
