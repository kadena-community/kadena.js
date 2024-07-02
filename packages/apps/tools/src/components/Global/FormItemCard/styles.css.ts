import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const helperStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: 'xs',
    cursor: 'pointer',
    fontSize: 'xs',
    color: 'text.base.default',
  }),
]);

export const helperTextIconStyle = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
    cursor: 'pointer',
    fontSize: 'sm',
    color: 'text.base.default',
  }),
]);

export const helperButtonIconStyle = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }),
]);
