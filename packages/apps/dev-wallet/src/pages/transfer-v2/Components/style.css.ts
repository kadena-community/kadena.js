import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const balanceClass = style({
  opacity: 0.7,
});

export const popoverClass = style({
  border: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
});
