import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const headerStyle = style([
  sprinkles({
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '$16',
  }),
]);

export const gridItemMainStyle = style([
  sprinkles({
    paddingTop: '$18',
    paddingBottom: '$12',
    paddingLeft: '$20',
    paddingRight: '$20',
  }),
]);

export const gridItemCollapsedSidebarStyle = style([
  sprinkles({
    position: 'fixed',
    right: 0,
    top: '$16',
    bottom: '$10',
    backgroundColor: '$gray90',
    width: '$16',
  }),
]);

export const footerStyle = style([
  sprinkles({
    backgroundColor: '$neutral2',
    width: '100%',
    bottom: 0,
    position: 'fixed',
    height: '$10',
  }),
]);
