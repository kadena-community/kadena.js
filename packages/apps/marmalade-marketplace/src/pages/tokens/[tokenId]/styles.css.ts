import { style } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';
import { deviceColors } from '../../../styles/tokens.css';

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

export const shareContainer = style({
  display: 'flex',
  margin: `${tokens.kda.foundation.spacing.n4} 0% 0`,
  gap: tokens.kda.foundation.spacing.n4,
  
});

export const tabContainer = style({
  backgroundColor: tokens.kda.foundation.color.background.layer.default
})

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

export const flexContainer = style({
  display: 'flex',
  gap:  tokens.kda.foundation.spacing.n2,
  borderRadius: tokens.kda.foundation.radius.sm,
  border: '1 0 0 0',
});

export const flexItem = style({
  flex: '1',
  margin: `0 ${tokens.kda.foundation.spacing.n4}`,
  gap: tokens.kda.foundation.spacing.n2
})

export const checkboxRow = style({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: tokens.kda.foundation.spacing.n2,
  marginTop: tokens.kda.foundation.spacing.n2,
});

