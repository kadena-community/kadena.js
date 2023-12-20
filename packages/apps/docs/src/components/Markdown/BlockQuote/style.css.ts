import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const blockquote = style([
  sprinkles({
    borderColor: '$neutral4',
    backgroundColor: '$infoLowContrast',
    fontSize: '$sm',
  }),
  {
    marginBlock: vars.sizes.$4,
    paddingBlock: vars.sizes.$2,
    paddingInlineStart: vars.sizes.$4,
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    whiteSpace: 'pre-wrap',
    ...responsiveStyle({
      md: {
        paddingInlineEnd: vars.sizes.$8,
      },
    }),
  },
]);
