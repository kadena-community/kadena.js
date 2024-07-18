import { atoms } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const networkListClass = style([
  atoms({
    padding: 'no',
  }),
]);

export const selectedNetworkClass = style([
  atoms({
    backgroundColor: 'base.@active',
  }),
]);

export const selectWrapperClass = style([]);

globalStyle(`${selectWrapperClass}`, {});
