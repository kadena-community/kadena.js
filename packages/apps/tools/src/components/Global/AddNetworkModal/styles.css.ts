import { atoms } from '@kadena/kode-ui/styles';
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
