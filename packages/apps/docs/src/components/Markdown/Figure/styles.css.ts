import { getClassName } from '@/utils/getClassName';
import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/theme';
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
  }),
  {
    marginBlockEnd: tokens.kda.foundation.size.n8,
    marginInline: tokens.kda.foundation.size.n4,
    ...responsiveStyle({
      md: {
        maxWidth: '50%',
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
