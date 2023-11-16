import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tabsContainer = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const tabList = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
  }),
  {
    borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral3}`,
  },
]);

// add border here and selected state
export const tabItem = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$1',
    fontSize: '$md',
    backgroundColor: 'transparent',
    color: '$neutral4',
  }),
  {
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-selected="true"]': {
        fontWeight: '$bold',
        color: vars.colors.$primaryContrastInverted,
      },
    },
  },
]);
