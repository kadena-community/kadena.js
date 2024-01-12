import { atoms, sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const formContentStyle = style([
  sprinkles({
    position: 'relative',
    height: '100%',
  }),
  {
    width: '680px',
    height: '65vh',
    overflow: 'scroll',
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

export const notificationLinkStyle = style([
  atoms({
    fontWeight: 'bodyFont.bold',
    color: 'text.semantic.warning.default',
    cursor: 'pointer',
  }),
]);

export const formButtonStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row-reverse',
    marginTop: '$4',
    paddingBottom: '$4',
    gap: '$8',
  }),
  {
    width: '680px',
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

export const textareaContainerStyle = style([
  sprinkles({
    display: 'flex',
    gap: '$sm',
  }),
]);
