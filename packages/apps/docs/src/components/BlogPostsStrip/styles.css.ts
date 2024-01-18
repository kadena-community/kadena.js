import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/theme';
import type { ComplexStyleRule } from '@vanilla-extract/css';
import { style } from '@vanilla-extract/css';

export const stripWrapper = style([
  atoms({
    marginBlockStart: 'md',
  }),
]);

export const stripClass = style([
  atoms({
    padding: 'no',
    display: 'flex',
  }),
  {
    width: '100%',
    listStyle: 'none',
    flexWrap: 'wrap',
  },
]);

export const stripItemWrapperClass = style([
  {
    paddingInlineEnd: tokens.kda.foundation.size.n8,
    marginBlockEnd: tokens.kda.foundation.size.n8,
    minWidth: '100px',
    flex: '100%',
    selectors: {
      '&:last-child': {
        display: 'block',
      },
    },

    ...responsiveStyle({
      md: {
        flex: '50%',
      },
      lg: {
        flex: '33%',
        selectors: {
          '&:last-child': {
            display: 'none',
          },
        },
      },
    }),
  },
]);

export const stripItemClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
  }),
  {
    marginBlockEnd: tokens.kda.foundation.size.n8,
    selectors: {
      '&:hover': {
        textDecoration: 'none',
        opacity: '.8',
      },
    },
  },
]);

export const figureClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'no',
    width: '100%',
    position: 'relative',
    backgroundColor: 'base.default',
    borderRadius: 'md',
  }),
  {
    aspectRatio: '20 / 9',
  },
]);

export const imageClass = style([
  atoms({
    borderRadius: 'md',
  }),
]);

export const headerClass = style([
  atoms({
    color: 'text.brand.primary.default',
    fontSize: 'lg',
  }),
  {
    paddingInlineEnd: tokens.kda.foundation.spacing.md,
    marginBlockStart: tokens.kda.foundation.spacing.md,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
]);

export const textClass = style([
  atoms({
    color: 'text.subtle.default',
  }),
  {
    paddingInlineEnd: tokens.kda.foundation.spacing.md,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
] as ComplexStyleRule);
