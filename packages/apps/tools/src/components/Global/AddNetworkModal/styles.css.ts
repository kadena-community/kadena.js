import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const modalOptionsContentStyle = style([
  sprinkles({
    width: '100%',
    fontSize: '$xs',
  }),
]);

export const formContentStyle = style([
  sprinkles({
    // position: 'relative',
    // height: '100%',
  }),
  {
    // width: '680px',
    // height: '65vh',
    // overflow: 'scroll',
  },
]);

export const notificationContainerStyle = style([
  sprinkles({
    marginY: '$sm',
  }),
  {
    width: '680px',
  },
]);

export const formButtonStyle = style([
  sprinkles({
    display: 'flex',
    // flexDirection: 'row-reverse',
    marginTop: '$4',
    gap: '$8',
  }),
  {
    // width: '680px',
  },
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

export const textAreaStyle = style([
  sprinkles({
    outline: 'none',
  }),
  {
    width: '-webkit-fill-available',
  },
]);

export const textareaContainerStyle = style([
  sprinkles({
    display: 'flex',
    gap: '$sm',
  }),
]);
