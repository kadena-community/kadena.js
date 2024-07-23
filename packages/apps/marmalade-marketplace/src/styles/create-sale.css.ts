import { style } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';
import { deviceColors } from './tokens.css';

export const container = style({
  margin: '160px 15% 0',
  backgroundColor: tokens.kda.foundation.color.background.surface.default,
  borderRadius: tokens.kda.foundation.radius.sm,
  border: `1px solid ${deviceColors.borderColor}`,
});

export const secondContainer = style({
  margin: '50px 15% 0',
  backgroundColor: tokens.kda.foundation.color.background.surface.default,
  borderRadius: tokens.kda.foundation.radius.sm,
  border: `1px solid ${deviceColors.borderColor}`,
});

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.kda.foundation.spacing.n4,
});

export const buttonRowContainer = style({
  margin: `${tokens.kda.foundation.spacing.n6} 15% 0`,
  justifyContent: 'space-between',
});

export const tokenImageClass = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: tokens.kda.foundation.radius.lg,
  margin: '-88px 0 20px',
});

export const propertyContainer = style({
  display: 'flex',
  marginBottom: '10px',
});

export const propertyLabel = style({
  flex: '1',
});

export const propertyValue = style({
  flex: '2',
});

export const offerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.kda.foundation.spacing.n4,
});
