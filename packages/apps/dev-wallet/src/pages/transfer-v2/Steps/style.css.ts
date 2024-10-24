import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const labelClass = style({
  minWidth: '80px',
  display: 'flex',
  background: tokens.kda.foundation.color.background.surface.default,
  padding: '5px',
});
