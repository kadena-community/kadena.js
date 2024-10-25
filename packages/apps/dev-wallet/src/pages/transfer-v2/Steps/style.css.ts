import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const labelClass = style({
  minWidth: '90px',
  display: 'flex',
  background: tokens.kda.foundation.color.background.surface.default,
  padding: '8px',
  marginLeft: '-12px',
});
