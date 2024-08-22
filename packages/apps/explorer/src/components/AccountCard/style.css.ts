import { tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const cardClass = style({});

globalStyle(`${cardClass}`, {
  padding: tokens.kda.foundation.spacing.md,
  alignSelf: 'flex-start',
});

globalStyle(`${cardClass} canvas`, {
  width: '100%!important',
  height: 'auto!important',
  aspectRatio: '1/1',
});
