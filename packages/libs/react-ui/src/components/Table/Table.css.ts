import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const tdClass = style([
  sprinkles({
    paddingY: '$3',
    paddingX: '$4',
    color: '$neutral5',
  }),
]);

export const trClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
  }),
  {
    selectors: {
      '&:nth-child(even)': {
        background: vars.colors.$neutral2,
      },
      '&:hover': {
        background: vars.colors.$primarySurface,
      },
    },
  },
]);

export const thClass = style([
  sprinkles({
    paddingY: '$3',
    paddingX: '$4',
    backgroundColor: '$neutral3',
    color: '$neutral6',
    textAlign: 'left',
  }),
]);

export const tableClass = style([
  sprinkles({
    width: '100%',
    borderRadius: '$sm',
    overflow: 'hidden',
  }),
  {
    border: `1px solid ${vars.colors.$neutral3}`,
    borderSpacing: 0,
  },
]);
