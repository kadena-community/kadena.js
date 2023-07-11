import { sprinkles, vars } from '../../styles';

import { createVar, fallbackVar, style } from '@vanilla-extract/css';

const textColor = createVar();

export const container = style([
  sprinkles({
    backgroundColor: '$neutral1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingX: '$lg',
    paddingY: '$md',
    borderRadius: '$sm',
    marginY: '$md',
    border: 'none',
    width: 'max-content',
    position: 'relative',
  }),
  {
    border: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
    color: fallbackVar(textColor, vars.colors.$neutral6),
  },
]);

export const fullWidthClass = style({
  width: '100%',
});

export const stackClass = style([
  sprinkles({ marginY: 0 }),
  {
    selectors: {
      '&:first-child': {
        borderRadius: `${vars.radii.$sm} ${vars.radii.$sm} 0 0`,
        borderBottom: 'none',
      },
      '&:last-child': {
        borderRadius: `0 0 ${vars.radii.$sm} ${vars.radii.$sm}`,
        borderTop: 'none',
      },
      '&:not(:last-child):before': {
        content: '',
        position: 'absolute',
        left: vars.sizes.$lg,
        bottom: 0,
        height: '1px',
        width: `calc(100% - ${vars.sizes.$lg} - ${vars.sizes.$lg})`,
        borderBottom: `${vars.borderWidths.$md} solid ${vars.colors.$neutral2}`,
      },
    },
  },
]);

export const disabledClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    pointerEvents: 'none',
  }),
  {
    border: `${vars.borderWidths.$md} solid ${vars.colors.$borderSubtle}`,

    vars: {
      [textColor]: vars.colors.$neutral3,
    },
  },
]);
