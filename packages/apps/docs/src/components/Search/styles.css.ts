import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const searchForm = style([
  sprinkles({
    width: '100%',
  }),
]);

export const staticResultsList = style([
  sprinkles({
    padding: 0,
  }),
  {
    listStyle: 'none',
  },
]);

export const scrollBox = style([
  sprinkles({
    position: 'relative',
    marginY: '$2',
    marginX: 0,
  }),
]);

export const scrollBoxEnabled = style([
  {
    overflowY: 'scroll',
    height: '55vh',
  },
]);

export const itemLink = style([
  sprinkles({
    display: 'block',
    marginBottom: '$4',
    textDecoration: 'none',
    padding: '$sm',
  }),
  {
    ':hover': {
      color: '$neutral100',
      backgroundColor: '$primaryContrast',
      borderRadius: '$sm',
    },
    ':focus': {
      color: '$neutral100',
      backgroundColor: '$primaryContrast',
      borderRadius: '$sm',
    },
  },
]);

export const itemSpan = style([
  sprinkles({
    color: '$neutral4',
  }),
]);

export const itemH5 = style([
  sprinkles({
    color: '$neutral4',
  }),
]);

export const itemP = style([
  sprinkles({
    color: '$neutral4',
  }),
]);

export const listItem = style([
  sprinkles({
    padding: 0,
  }),
]);

export const loadingWrapper = style([
  sprinkles({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    paddingY: '$10',
    background: '$layoutSurfaceOverlay',
  }),
  {
    inset: 0,
  },
]);
