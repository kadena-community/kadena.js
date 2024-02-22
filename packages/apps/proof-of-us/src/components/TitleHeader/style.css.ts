import { style } from '@vanilla-extract/css';

export const titleClass = style([
  {
    width: '1fr',
    textTransform: 'capitalize',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);
