import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const searchFormClass = style([
  atoms({
    width: '100%',
  }),
]);

export const buttonClass = style([
  atoms({
    border: 'none',
    paddingInline: 'n2',
    cursor: 'pointer',
    color: 'icon.base.default',
  }),
  {
    backgroundColor: 'transparent',
  },
]);
