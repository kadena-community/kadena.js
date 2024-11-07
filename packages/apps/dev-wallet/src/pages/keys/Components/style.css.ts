import { style } from '@kadena/kode-ui';
import { tokens } from '@kadena/kode-ui/styles';

export const keyItemClass = style({
  paddingInlineStart: tokens.kda.foundation.spacing.sm,
  background: tokens.kda.foundation.color.background.input.default,
});

export const keyColumnClass = style({
  flex: 1,
  paddingInlineStart: tokens.kda.foundation.spacing.xxxl,
});

export const ellipsisClass = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
