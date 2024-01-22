import { atoms } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const modalOptionsContentStyle = style([
  atoms({
    width: '100%',
    paddingBlockStart: 'xs',
  }),
]);

export const formButtonStyle = style([
  atoms({
    display: 'flex',
    marginBlockStart: 'md',
    gap: 'xl',
  }),
]);
