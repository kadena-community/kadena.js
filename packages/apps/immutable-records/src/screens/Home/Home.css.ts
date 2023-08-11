import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const header = style([
  sprinkles({
    padding: '$4',
  }),
  {
    background: '#ccc',
  },
]);

export const main = style([
  sprinkles({
    margin: '$4',
  }),
]);

export const panel = style([
  sprinkles({
    padding: '$2',
    marginY: '$2',
  }),
  {
    background: '#ccc',
  },
]);
