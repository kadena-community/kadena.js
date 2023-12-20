import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const blockquote = style([
  sprinkles({
    borderColor: '$neutral4',
    backgroundColor: '$infoLowContrast',
    marginBlock: '$4',
    paddingBlock: '$2',
    paddingInlineStart: '$4',
    fontSize: '$sm',
  }),
  {
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
