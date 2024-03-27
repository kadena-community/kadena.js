import { globalStyle, style } from '@vanilla-extract/css';

export const qrClass = style({
  maxWidth: '500px',
  maxHeight: '500px',
  width: '100%',
  height: '100%',
  aspectRatio: '1/1',
});

globalStyle(`${qrClass} canvas`, {
  width: '100%!important',
  height: '100%!important',
  aspectRatio: '1/1',
});
