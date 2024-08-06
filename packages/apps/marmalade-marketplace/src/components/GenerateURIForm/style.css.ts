import { style } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';

export const tokenImageContainer = style({
  width: '100%',
  height: '100%',
  minHeight: '336px',
  objectFit: 'cover',
  borderRadius: tokens.kda.foundation.radius.lg,
  backgroundColor: tokens.kda.foundation.color.background.layer.default,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  border: `2px dashed ${tokens.kda.foundation.color.border.base.subtle}`,
  margin: '-88px 0 20px',
});

export const uploadContainer = style({
  display: 'flex',
  height: '336px',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

export const uploadIcon = style({
  height: '54px',
  color: tokens.kda.foundation.color.icon.base.default,
});

