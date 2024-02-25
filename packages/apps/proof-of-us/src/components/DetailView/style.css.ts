import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const imageWrapper = style([
  atoms({
    position: 'relative',
  }),
]);

export const titleErrorClass = style([
  atoms({
    color: 'icon.semantic.warning.default',
  }),
]);
