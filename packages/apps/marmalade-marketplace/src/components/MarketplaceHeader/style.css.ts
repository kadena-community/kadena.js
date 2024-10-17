import { token, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const navHeader = style({
  backgroundColor: token('color.background.layer.default'),
});

export const navHeaderLink = style({
  fontSize: 'clamp(12px, 1.1vw, 16px)',
});
