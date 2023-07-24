import { sprinkles } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const gridStyle = style([
  sprinkles({
    display: 'grid',
  }),
  {
    justifyItems: 'stretch',
    alignItems: 'stretch',
  },
]);
export const gridVariants = styleVariants({
  hasMenu: [
    {
      gridTemplateAreas: `"mini-menu menu main collapsed-sidebar"`,
      gridTemplateColumns: '64px 280px auto 64px',
    },
  ],
  noMenu: [
    {
      gridTemplateAreas: `"mini-menu main collapsed-sidebar"`,
      gridTemplateColumns: '64px auto 64px',
    },
  ],
});

export const headerStyle = style([
  sprinkles({
    position: 'sticky',
    top: 0,
    width: '100%',
    height: '$16',
  }),
]);

export const gridItemMainStyle = style([
  sprinkles({
    paddingTop: '$2',
    paddingBottom: '$2',
    paddingLeft: '$6',
    paddingRight: '$6',
  }),
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
    height: '$10',
  }),
]);
