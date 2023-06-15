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
  {
    selectors: {
      '&:nth-child(even)': {
        background: vars.colors.$neutral2,
      },
    },
  },
]);

export const thClass = style([
  sprinkles({
    paddingY: '$3',
    paddingX: '$4',
    backgroundColor: '$neutral4',
    color: '$neutral2',
    textAlign: 'left',
  }),
]);

export const tableClass = style([
  sprinkles({
    width: '100%',
    borderSpacing: 0,
    borderRadius: '$sm',
    overflow: 'hidden',
  }),
  {
    border: `1px solid ${vars.colors.$neutral3}`,
  },
]);

export const urlContainerClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
]);
