import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
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
    backgroundColor: tokens.kda.foundation.color.palette.blue.n1,
    color: tokens.kda.foundation.color.text.base.default,
  },
]);

export const docsCardLink = style([
  atoms({
    textDecoration: 'none',
    fontWeight: 'secondaryFont.bold',
  }),
  {
    color: tokens.kda.foundation.color.text.base.default,
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);
