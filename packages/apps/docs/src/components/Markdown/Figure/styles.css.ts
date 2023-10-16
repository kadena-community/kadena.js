import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';

import { paragraphWrapperClass } from '../Paragraph/styles.css';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const figure = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginX: 0,
    marginY: 0,
    width: '100%',
    position: 'relative',
  }),
  {
    ...responsiveStyle({
      md: {
        boxSizing: 'border-box',
        marginLeft: vars.sizes.$5,
        marginRight: vars.sizes.$5,
        marginBottom: vars.sizes.$8,
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
    marginBottom: '$8',
    marginX: '$4',
  }),
  {
    ...responsiveStyle({
      md: {
        maxWidth: '50%',
        marginTop: vars.sizes.$2,
        marginLeft: 0,
        marginRight: 0,
      },
    }),
  },
]);

globalStyle(
  `${getClassName(paragraphWrapperClass)} +
  figure
  `,
  {
    marginTop: vars.sizes.$4,
  },
);

globalStyle(`table figure`, {
  margin: '0 !important',
});
