import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const gridStyle = style([
  sprinkles({
    display: 'grid',
  }),
  {
    gridTemplateAreas: `"mini-menu menu main collapsed-sidebar"`,
    gridTemplateColumns: '64px 280px auto 64px',
    justifyItems: 'stretch',
    alignItems: 'stretch',
  },
]);

export const headerStyle = style([
  sprinkles({
    position: 'sticky',
    top: 0,
    width: '100%',
  }),
  {
    height: '64px',
  },
]);

export const gridItemMiniMenuStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
  }),
  {
    gridArea: 'mini-menu',
  },
]);

export const gridItemMenuStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
  }),
  {
    gridArea: 'menu',
  },
]);

export const gridItemMainStyle = style([
  {
    gridArea: 'main',
  },
]);

export const gridItemCollapsedSidebarStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
  }),
  {
    gridArea: 'collapsed-sidebar',
  },
]);

export const footerStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
    width: '100%',
    bottom: 0,
    position: 'sticky',
  }),
  {
    height: '40px',
  },
]);
