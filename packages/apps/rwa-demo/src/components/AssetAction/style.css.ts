import { style } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

export const assetActionWrapper = style([{ flex: 1 }]);

globalStyle(`${assetActionWrapper} svg`, {
  fontSize: '2rem',
  aspectRatio: '1/1',
});
