import { style } from '@vanilla-extract/css';
import { tokens, token } from '@kadena/kode-ui/styles';

export const navHeader = style({
  backgroundColor: token('color.background.layer.default')
});

export const navHeaderLink = style({
  fontSize: token('typography.fontSize.base')
});
