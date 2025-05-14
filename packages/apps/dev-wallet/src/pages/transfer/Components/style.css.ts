import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const balanceClass = style({
  opacity: 0.7,
});

export const popoverClass = style({
  border: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
});

export const titleBadgeClass = style({

});

export const createAccountBoxClass = style({
  backgroundColor:
    tokens.kda.foundation.color.background.semantic.warning.subtle,
  borderColor: tokens.kda.foundation.color.border.semantic.warning.default,
  color: tokens.kda.foundation.color.text.semantic.warning.default,
  borderLeft: 'solid 4px',
});

export const labelClass = style({
  minWidth: '90px',
  display: 'flex',
  background: tokens.kda.foundation.color.background.surface.default,
  padding: '8px',
  marginLeft: '-12px',
  fontWeight: '700',
});

export const hideInMobileClass = style({
  '@media': {
    '(max-width: 460px)': {
      display: 'none',
    },
  },
});
