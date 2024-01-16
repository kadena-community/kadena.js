import { atoms } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const formContentStyle = style([
  atoms({
    position: 'relative',
  }),
  {
    width: '680px',
    height: '65vh',
    overflow: 'scroll',
  },
]);

export const notificationContainerStyle = style([
  atoms({
    marginBlock: 'sm',
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
  atoms({
    display: 'flex',
    flexDirection: 'row-reverse',
    marginBlockStart: 'md',
    paddingBlockEnd: 'md',
    gap: 'xl',
  }),
  {
    width: '680px',
  },
]);

export const textareaContainerStyle = style([
  atoms({
    display: 'flex',
    gap: 'sm',
  }),
]);
