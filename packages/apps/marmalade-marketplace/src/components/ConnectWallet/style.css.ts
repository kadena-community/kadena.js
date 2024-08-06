import { style, globalStyle } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';

export const connectWalletContainer = style({
  display: 'flex',
  alignItems: 'center',  
});
  
export const walletButton = style({
  height: '40px',
  borderTopRightRadius: '0',
  borderBottomRightRadius: '0',
  borderRight: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.inverse.default}`,
});

export const selectButton = style({
  display: 'flex',
  alignItems: 'center',  
  height: '40px',
  width: '40px',  
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0',
});

globalStyle(`${selectButton} > span`, {
  margin: '0',
  transform: 'rotate(90deg)',
});

export const contextMenu = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '180px',
  position: 'absolute',
  top: '60px',
  right: '25px',
  backgroundColor: tokens.kda.foundation.color.background.input.default,      
  borderRadius: tokens.kda.foundation.radius.sm,  
  padding: `${tokens.kda.foundation.spacing.n2} 0`,
  zIndex: 1000,
});

export const contextMenuItem = style({
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  paddingLeft: tokens.kda.foundation.spacing.n4,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: tokens.kda.foundation.color.background.accent.primary.default,
  },
  ':focus': {
    backgroundColor: tokens.kda.foundation.color.background.input.inverse['@focus'],
  },
  fontSize: tokens.kda.foundation.typography.fontSize.sm,  
});

globalStyle(`${contextMenuItem} :hover`, {
  marginRight: '80px',  
});

globalStyle(`${contextMenuItem} > span`, {
  marginRight: tokens.kda.foundation.spacing.n2,  
});
