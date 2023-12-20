import { getClassName } from '@/utils/getClassName';
import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const figure = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginInline: 0,
    marginBlock: 0,
    width: '100%',
    position: 'relative',
  }),
  {
    ...responsiveStyle({
      md: {
        boxSizing: 'border-box',
        marginInlineStart: vars.sizes.$5,
        marginInlineEnd: vars.sizes.$5,
        marginBlockEnd: vars.sizes.$8,
      },
    }),
  },
]);

export const figureImg = style([
  sprinkles({
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
  sprinkles({
    textAlign: 'center',
  }),
  {
    marginBlockEnd: vars.sizes.$8,
    marginInline: vars.sizes.$4,
    ...responsiveStyle({
      md: {
        maxWidth: '50%',
        marginBlockStart: vars.sizes.$2,
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
    marginBlockStart: vars.sizes.$4,
  },
);

globalStyle(`table figure`, {
  margin: '0 !important',
});
