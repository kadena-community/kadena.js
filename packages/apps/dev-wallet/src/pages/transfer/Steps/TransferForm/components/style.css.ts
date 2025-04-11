import { style } from '@kadena/kode-ui';
import { globalStyle } from '@kadena/kode-ui/styles';

export const signOptionsRadioWrapperClass = style({});

globalStyle(`${signOptionsRadioWrapperClass} [class^="Radio"] input`, {
  visibility: 'hidden',
});
