import {
  atoms,
  darkThemeClass,
  responsiveStyle,
  tokens,
} from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const descriptionWrapperClass = style([
  {
    ...responsiveStyle({
      sm: {
        marginInlineEnd: tokens.kda.foundation.size.n20,
      },
      md: {
        marginInlineEnd: tokens.kda.foundation.spacing.md,
      },
      lg: {
        marginInlineEnd: tokens.kda.foundation.size.n20,
      },
    }),
  },
]);

export const cardClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    borderRadius: 'md',
    paddingInline: 'xxxl',
    paddingBlock: 'lg',
  }),
  {
    transition: 'all .3s ease',
    background: 'linear-gradient(215deg, #D2D4D6 0%, #D6EBFF 100%)',
    selectors: {
      [`${darkThemeClass} &`]: {
        background: 'linear-gradient(214deg, #194268 -1.51%, #9EA3A7 116.65%);',
      },
    },
  },
]);

export const docsCardLink = style([
  atoms({
    textDecoration: 'none',
    fontWeight: 'secondaryFont.bold',
  }),
  {
    color: tokens.kda.foundation.color.text.base.default,
  },
]);

// DOC CARDS
