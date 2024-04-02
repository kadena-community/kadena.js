import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const formContentStyle = style([
  atoms({
    position: 'relative',
  }),
  {
    width: '680px',
    height: '65vh',
    overflow: 'auto',
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
    fontWeight: 'secondaryFont.bold',
    textDecoration: 'underline',
    color: 'inherit',
    cursor: 'pointer',
  }),
]);

export const notificationKeyStyle = style([
  atoms({
    fontWeight: 'secondaryFont.bold',
    color: 'inherit',
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

export const textareaWrapperStyle = style([
  atoms({
    width: '100%',
  }),
]);
