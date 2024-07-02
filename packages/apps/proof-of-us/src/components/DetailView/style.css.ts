import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const imageWrapper = style([
  atoms({
    position: 'relative',
  }),
  {
    marginLeft: '-12px',
    marginRight: '-12px',
  },
]);

export const titleErrorClass = style([
  atoms({
    color: 'icon.semantic.warning.default',
  }),
]);
