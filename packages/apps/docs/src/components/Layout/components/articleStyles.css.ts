import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$maxPageContentWidth, $$pageWidth } from '../global.css';

import type { LayoutType } from '@/Layout';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const articleClass = style([
  sprinkles({
    width: '100%',
    paddingY: 0,
    backgroundColor: 'transparent',
  }),
  {
    zIndex: 3,
    maxWidth: $$maxPageContentWidth,
    paddingInline: vars.sizes.$4,

    ...responsiveStyle({
      md: {
        paddingInline: vars.sizes.$10,
      },
    }),
  },
]);

export const landingPageArticleWrapper = style([
  {
    maxWidth: $$pageWidth,
    margin: '0 auto',
  },
]);

export const blogchainArticleWrapperClass = style([
  {
    width: '100vw',
    margin: '0 auto',
    maxWidth: $$pageWidth,
  },
]);

globalStyle(`article[data-max-width="false"]`, {
  maxWidth: 'unset !important',
});

export const contentClass = style([
  sprinkles({
    display: 'flex',
    position: 'relative',

    paddingX: 0,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  }),
  {
    gridColumn: '1 / span 2',
    gridRow: '3 / span 1',

    ...responsiveStyle({
      md: {
        gridColumn: '3 / span 1',
        gridRow: '3 / span 1',
      },
    }),
  },
]);

export const contentClassVariants: Record<LayoutType, string> = styleVariants({
  home: responsiveStyle({
    md: {
      gridColumn: '2 / span 3',
    },
  }),
  code: responsiveStyle({
    md: {
      gridColumn: '3 / span 1',
    },
  }),
  landing: {
    gridColumn: '1 / span 1',
    ...responsiveStyle({
      md: {
        gridColumn: '3 / span 1',
      },
    }),
  },
  full: {},
  blog: {
    paddingTop: 0,
  },
  redocly: {},
});
