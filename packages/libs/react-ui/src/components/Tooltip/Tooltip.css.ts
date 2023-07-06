import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
    placeItems: 'center',
    gap: '$2',
    borderRadius: '$md',
    paddingX: '$4',
    paddingY: '$3',
    border: 'none',
    fontSize: '$base',
    backgroundColor: '$neutral1',
    color: '$neutral6',
    width: 'max-content',
  }),
  {
    position: 'relative',
    border: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
  },
]);

export const arrowLeft = style([
  sprinkles({
    position: 'absolute',
    width: '$4',
    height: '$4',
    backgroundColor: '$neutral1',
  }),
  {
    top: `calc(50% - ${vars.sizes.$4} / 2)`,
    left: `calc((-1 * ${vars.sizes.$4} / 2) - 1px)`,
    rotate: '45deg',
    borderLeft: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
    borderBottom: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
  },
]);
