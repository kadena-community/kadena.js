import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const blockquote = style([
  sprinkles({
    paddingLeft: '$4',
    borderColor: '$neutral4',
  }),
  {
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
  },
]);
