import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

import type { LayoutType } from '@/types/Layout';
import { style, styleVariants } from '@vanilla-extract/css';

export const articleClass = style([
  sprinkles({
    width: '100%',
    paddingY: 0,
    paddingX: '$10',
    backgroundColor: 'transparent',
  }),
]);

export const contentClass = style([
  sprinkles({
    display: 'flex',
    position: 'relative',
    paddingTop: '$10',
    paddingX: 0,
    paddingBottom: '$35',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  }),
  {
    gridColumn: '1 / span 2',
    gridRow: '3 / span 1',
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        gridColumn: '3 / span 1',
        gridRow: '3 / span 1',
      },
    },
  },
]);

export const contentClassVariants: Record<LayoutType, string> = styleVariants({
  home: {
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        gridColumn: '2 / span 3',
      },
    },
  },
  code: {
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        gridColumn: '3 / span 1',
      },
    },
  },
  landing: {
    gridColumn: '1 / span 1',
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        gridColumn: '3 / span 1',
      },
    },
  },
  full: {},
  blog: {},
  redocly: {},
});
