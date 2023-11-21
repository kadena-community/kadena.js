import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tabsContainer = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  {
    alignContent: 'center',
  },
]);

export const tabList = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
  }),
]);

export const tabItem = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$1',
    paddingX: '$2',
    fontSize: '$md',
    backgroundColor: 'transparent',
    color: '$neutral4',
  }),
  {
    borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral2}`,
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-selected="true"]': {
        fontWeight: '$bold',
        borderBottom: `${vars.sizes.$1} solid ${vars.colors.$primaryAccent}`,
        color: vars.colors.$primaryContrastInverted,
        [`&${darkThemeClass}`]: {
          borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral6}`,
        },
      },
      [`${darkThemeClass} &`]: {
        borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral3}`,
      },
    },
  },
]);
