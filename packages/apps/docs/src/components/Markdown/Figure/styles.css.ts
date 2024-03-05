import { getClassName } from '@/utils/getClassName';
import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const figure = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginInline: 'no',
    marginBlock: 'no',
    width: '100%',
    position: 'relative',
  }),
  {
    ...responsiveStyle({
      md: {
        boxSizing: 'border-box',
        marginInlineStart: tokens.kda.foundation.size.n5,
        marginInlineEnd: tokens.kda.foundation.size.n5,
        marginBlockEnd: tokens.kda.foundation.size.n8,
      },
    }),
  },
]);

export const figureImg = style([
  atoms({
    height: '100%',
    width: '100%',
  }),
  {
    ...responsiveStyle({
      md: {
        width: 'unset',
      },
    }),
  },
]);

export const figCaption = style([
  atoms({
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
  }),
  {
    marginBlockEnd: tokens.kda.foundation.size.n8,
    marginInline: tokens.kda.foundation.size.n4,
    ...responsiveStyle({
      md: {
        marginBlockStart: tokens.kda.foundation.size.n2,
        marginInlineStart: 0,
        marginInlineEnd: 0,
      },
    }),
  },
]);

globalStyle(
  `${getClassName(paragraphWrapperClass)} +
  figure
  `,
  {
    marginBlockStart: tokens.kda.foundation.size.n4,
  },
);

globalStyle(`table figure`, {
  margin: '0 !important',
});

export const imageModalClass = style([
  atoms({
    width: '100%',
  }),
  {
    outline: 0,
    maxWidth: '100vw',
    maxHeight: '100vh',
    backgroundColor: 'transparent',
    border: 0,
    paddingInline: tokens.kda.foundation.spacing.xs,
    ...responsiveStyle({
      md: {
        paddingInline: tokens.kda.foundation.spacing.xl,
      },
    }),
  },
]);
export const imageModalAltTextClass = style([
  atoms({
    marginBlock: 'md',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  }),
  {
    color: tokens.kda.foundation.color.text.base.inverse.default,
  },
]);

globalStyle(`${imageModalClass} button`, {
  top: `calc(0px - ${tokens.kda.foundation.spacing.sm})`,
  right: 0,
  color: tokens.kda.foundation.color.text.base.inverse.default,

  ...responsiveStyle({
    md: {
      paddingInline: tokens.kda.foundation.spacing.xl,
    },
  }),
});
