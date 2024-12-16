import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const accountClass = style({
  background: tokens.kda.foundation.color.background.surface.default,
});

export const needActionClass = style({
  outline: `2px solid ${tokens.kda.foundation.color.border.overlay.context}`,
  padding: '10px',
  marginBlock: '10px',
});
