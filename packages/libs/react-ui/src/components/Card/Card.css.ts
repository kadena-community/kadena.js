import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    backgroundColor: '$neutral2',
    color: '$neutral6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingX: '$lg',
    paddingY: '$md',
    borderRadius: '$sm',
    marginY: '$md',
    border: 'none',
    width: 'max-content',
  }),
]);

export const fullWidthClass = style([sprinkles({ width: '100%' })]);

export const stackClass = style([
  sprinkles({ marginY: 0 }),
  {
    selectors: {
      '&:not(:last-child)': {
        borderBottom: `1px solid ${vars.colors.$neutral3}`,
      },
      '&:first-child': {
        borderRadius: `${vars.radii.$sm} ${vars.radii.$sm} 0 0`,
      },
      '&:last-child': {
        borderRadius: `0 0 ${vars.radii.$sm} ${vars.radii.$sm}`,
      },
    },
  },
]);
