import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const gridItemCollapsedSidebarStyle = style([
  sprinkles({
    position: 'fixed',
    right: 0,
    top: '$16',
    bottom: '$10',
    backgroundColor: '$neutral1',
    width: '$16',
    zIndex: 1,
  }),
  {
    borderLeft: `solid 1px ${vars.colors.$borderSubtle}`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${vars.sizes.$64} + ${vars.sizes.$35})`,
      },
    },
  },
]);

export const buttonWrapperClass = style([
  sprinkles({
    paddingTop: '$3',
    paddingBottom: '$3',
    paddingLeft: '$2',
    paddingRight: '$2',
  }),
  {
    borderBottom: `solid 1px ${vars.colors.$borderSubtle}`,
  },
]);

export const expandedDrawerTitleClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '$4',
    paddingBottom: '$4',
    paddingLeft: '$6',
    paddingRight: '$4',
    height: '$20',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);

export const expandedDrawerContentClass = style([
  sprinkles({
    paddingTop: '$4',
    paddingBottom: '$4',
    paddingLeft: '$6',
    paddingRight: '$6',
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    overflowY: 'auto',
    height: `calc(100% - ${vars.sizes.$20})`,
  },
]);
