import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const searchFormClass = style([
  sprinkles({
    width: '100%',
  }),
]);

export const staticResultsListClass = style([
  sprinkles({
    padding: 0,
  }),
  {
    listStyle: 'none',
  },
]);

export const scrollBoxClass = style([
  sprinkles({
    position: 'relative',
    marginY: '$2',
    marginX: 0,
  }),
]);

export const scrollBoxEnabledClass = style([
  {
    overflowY: 'scroll',
    height: '55vh',
  },
]);

export const itemLinkClass = style([
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

export const loadingWrapperClass = style([
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
