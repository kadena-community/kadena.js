import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const blockquote = style([
  sprinkles({
    borderColor: '$neutral4',
    backgroundColor: '$infoLowContrast',
    marginY: '$4',
    paddingY: '$2',
    paddingLeft: '$4',
    fontSize: '$sm',
  }),
  {
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    ...responsiveStyle({
      md: {
        paddingRight: vars.sizes.$8,
      },
    }),
  },
]);
