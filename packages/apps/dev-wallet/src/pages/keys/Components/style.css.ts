import { style } from '@kadena/kode-ui';
import { tokens } from '@kadena/kode-ui/styles';

export const keyItemClass = style({
  paddingInlineStart: tokens.kda.foundation.spacing.sm,
  background: tokens.kda.foundation.color.background.input.default,
});

export const keyColumnClass = style({
  flex: 1,
  paddingInlineStart: tokens.kda.foundation.spacing.xxxl,
  borderLeft: `1px solid ${tokens.kda.foundation.color.border.base.default}`,
});
