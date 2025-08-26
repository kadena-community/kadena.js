import { style } from '@kadena/kode-ui';
import { globalStyle } from '@vanilla-extract/css';

export const assetsSwitchWrapperClass = style({
  width: '100%',
});

globalStyle(`${assetsSwitchWrapperClass} > section`, {
  flex: 1,
  width: '100%',
});

globalStyle(`${assetsSwitchWrapperClass} > section > span:first-child`, {
  flex: 1,
});
