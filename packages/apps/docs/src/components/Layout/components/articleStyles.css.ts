import type { LayoutType } from '@kadena/docs-tools';
import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const containerClass = style({
  marginBlockEnd: tokens.kda.foundation.size.n20,
});

export const articleClass = style([
  atoms({
    width: '100%',
    paddingBlock: 'no',
    backgroundColor: 'transparent',
    paddingInline: 'md',
  }),
  {
    zIndex: 3,
    ...responsiveStyle({
      md: {
        paddingInline: tokens.kda.foundation.spacing.xxxl,
      },
    }),
  },
]);

export const contentClass = style([
  atoms({
    display: 'flex',
    position: 'relative',
    paddingInline: 'no',
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
  full: {
    ...responsiveStyle({
      md: {
        gridColumn: '3 / span 2',
      },
      lg: {
        gridColumn: '3 / span 1',
      },
    }),
  },
  redocly: {},
});
