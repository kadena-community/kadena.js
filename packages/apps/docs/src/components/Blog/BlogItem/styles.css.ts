import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const blogitem = style([
  sprinkles({
    padding: 0,
    borderRadius: '$md',
    backgroundColor: 'transparent',
  }),
  {
    willChange: 'background-color',
    transition: 'background-color .2s ease',
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
    padding: '$5',
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
    paddingBottom: '$10',
  }),

  {
    borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
    opacity: '.6',
  },
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
