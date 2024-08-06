import { style, globalStyle } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';

export const checkboxRow = style({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: tokens.kda.foundation.spacing.n2,
  marginTop: tokens.kda.foundation.spacing.n2,
});

globalStyle(`${checkboxRow} label`, {
  flex: 1,
});

export const buttonRow = style({
    display: 'flex',
    justifyContent: 'space-between',
    margin: `${tokens.kda.foundation.spacing.n6} 15% 0`,
  });

export const container = style({
    margin: '160px 15% 0',
    backgroundColor: tokens.kda.foundation.color.background.layer.default,
    borderRadius: tokens.kda.foundation.radius.sm,
    border: `1px solid ${tokens.kda.foundation.color.border.base.subtle}`,
});

export const buttonRowContainer = style({
    margin: `${tokens.kda.foundation.spacing.n6} 15% 0`,
    justifyContent: 'space-between',
});

export const tokenImageContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '336px',  
  margin: '-88px 0 20px',
});

export const tokenImageClass = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: tokens.kda.foundation.radius.lg,  
});
  
export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.kda.foundation.spacing.n4,
});

export const errorBox = style({
  color: 'red',
  backgroundColor: '#ffe6e6',
  border: '1px solid red',
  borderRadius: '5px',
  padding: '10px',
  margin: '10px 0',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px'
});
