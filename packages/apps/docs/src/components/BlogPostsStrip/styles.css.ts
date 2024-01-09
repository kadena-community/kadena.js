import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import type { ComplexStyleRule } from '@vanilla-extract/css';
import { style } from '@vanilla-extract/css';

export const stripWrapper = style([
  sprinkles({
    marginBlockStart: '$md',
  }),
]);

export const stripClass = style([
  sprinkles({
    padding: 0,
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
    paddingInlineEnd: vars.sizes.$8,
    marginBlockEnd: vars.sizes.$8,
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
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
  }),
  {
    marginBlockEnd: vars.sizes.$8,
    selectors: {
      '&:hover': {
        textDecoration: 'none',
        opacity: '.8',
      },
    },
  },
]);

export const figureClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,
    width: '100%',
    position: 'relative',
    backgroundColor: '$neutral2',
    borderRadius: '$md',
  }),
  {
    aspectRatio: '20 / 9',
  },
]);

export const imageClass = style([
  sprinkles({
    borderRadius: '$md',
  }),
]);

export const headerClass = style([
  sprinkles({
    color: '$primaryContrastInverted',
    fontSize: '$lg',
  }),
  {
    paddingInlineEnd: vars.sizes.$4,
    marginBlockStart: vars.sizes.$4,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
]);

export const textClass = style([
  sprinkles({
    color: '$foreground',
  }),
  {
    paddingInlineEnd: vars.sizes.$4,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
] as ComplexStyleRule);
