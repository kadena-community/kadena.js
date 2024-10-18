import { tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const checkboxRow = style({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: tokens.kda.foundation.spacing.n2,
  marginTop: tokens.kda.foundation.spacing.n2,
});

globalStyle(`${checkboxRow} label`, {
  flex: 1,
});
