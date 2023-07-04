import { sprinkles } from '@theme/sprinkles.css';

import { style } from '@vanilla-extract/css';

export const tagClass = style([
  sprinkles({
    backgroundColor: '$foreground',
    color: '$background',
    borderRadius: '$sm',
    paddingX: '$2',
    fontSize: '$xs',
    fontWeight: '$semiBold',
    display: 'inline-block',
  }),
  {
    paddingTop: '0.05rem',
    paddingBottom: '0.05rem',
  },
]);
