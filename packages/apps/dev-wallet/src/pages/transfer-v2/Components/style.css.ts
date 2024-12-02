import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const balanceClass = style({
  opacity: 0.7,
});

export const popoverClass = style({
  border: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
});

export const createAccountBoxClass = style({
  backgroundColor:
    tokens.kda.foundation.color.background.semantic.warning.subtle,
  borderColor: tokens.kda.foundation.color.border.semantic.warning.default,
  color: tokens.kda.foundation.color.text.semantic.warning.default,
  borderLeft: 'solid 4px',
});
