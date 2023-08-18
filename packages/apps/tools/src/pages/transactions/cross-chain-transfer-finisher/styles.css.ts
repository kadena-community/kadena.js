import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const formContentStyle = style([
  sprinkles({
    position: 'relative',
    height: '100%',
    zIndex: 0,
  }),
  {
    width: '680px',
    overflow: 'overflow'
  },
]);

export const notificationContainerStyle = style([
  sprinkles({
    // position: 'absolute',
    top: 0,
    zIndex: 1,
  }),
  {
    width: '680px',
  },
]);

export const formButtonStyle = style([
  sprinkles({
    // alignItems: '',
    display: 'flex',
    flexDirection: 'row-reverse',
    marginTop: '$4',
    gap: '$8',
  }),
]);

export const sideContentStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const formHeaderStyle = style([
  sprinkles({
    display: 'flex',
    paddingTop: '$6',
    paddingRight: '$10',
    paddingLeft: '$10',
    alignItems: 'flex-start',
    gap: '$2',
  }),
  {
    alignSelf: 'stretch',
    background: 'rgba(71, 79, 82, 0.4)',
  },
]);

export const sidebarLinksStyle = style([
  sprinkles({
    width: '100%',
    marginBottom: '$md',
    position: 'absolute',
    bottom: 0,
  }),
]);
