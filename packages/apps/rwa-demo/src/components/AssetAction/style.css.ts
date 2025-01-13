import { style, token } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

export const assetActionWrapper = style([
  {
    flex: '33%',
    maxWidth: '150px',
    aspectRatio: '1/1',
    textAlign: 'center',
    alignItems: 'stretch',
  },
]);

globalStyle(`${assetActionWrapper} svg`, {
  color: token('color.text.base.default'),
  fontSize: '2rem',
  aspectRatio: '1/1',
});
