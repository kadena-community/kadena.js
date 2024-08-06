import { style } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';

export const navHeader = style({
  backgroundColor: tokens.kda.foundation.color.background.layer.default,
});

export const navHeaderLink = style({
  fontSize: tokens.kda.foundation.typography.fontSize.base,
});
