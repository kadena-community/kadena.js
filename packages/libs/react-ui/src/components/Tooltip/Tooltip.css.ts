import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
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
    position: 'absolute',
    display: 'none',
  }),
  {
    top: '50%',
    marginRight: '-50%',
    border: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
  },
]);

export const baseArrow = style([
  sprinkles({
    position: 'absolute',
    width: '$4',
    height: '$4',
    backgroundColor: '$neutral1',
  }),
  {
    rotate: '45deg',
  },
]);

export const arrowVariants = styleVariants({
  right: [
    baseArrow,
    {
      top: `calc(50% - ${vars.sizes.$4} / 2)`,
      left: `calc((-1 * ${vars.sizes.$4} / 2) - 1px)`,
      borderLeft: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
      borderBottom: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
    },
  ],
  left: [
    baseArrow,
    {
      top: `calc(50% - ${vars.sizes.$4} / 2)`,
      right: `calc((-1 * ${vars.sizes.$4} / 2) - 1px)`,
      borderRight: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
      borderTop: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
    },
  ],
  top: [
    baseArrow,
    {
      top: `calc(100% - ${vars.sizes.$4} / 2)`,
      borderBottom: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
      borderRight: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
    },
  ],
  bottom: [
    baseArrow,
    {
      top: `calc(-1 * ${vars.sizes.$4} / 2)`,
      borderTop: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
      borderLeft: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
    },
  ],
});

export const visibleClass = style([
  sprinkles({
    display: 'flex',
  }),
]);
