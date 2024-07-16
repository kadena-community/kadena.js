
import { style } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';

export const navHeader = style({
  backgroundColor: tokens.kda.foundation.color.background.layer.default,
});

export const navHeaderLink = style({
  fontSize: tokens.kda.foundation.typography.fontSize.base,
});

export const walletButton = style({
  height: '40px',
});

export const walletButtonBadge = style({
  color: 'gray',
});

export const selectContainer = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
});

export const walletOption = style({
  display: 'flex',
  width: '40px',
  alignItems: 'center',
  marginLeft: '0',
  backgroundColor: '#52FFC6',
  padding: '0 1em',
  outline: 'none',
});

export const walletContainer = style({
  display: 'flex',
  alignItems: 'center',
});
