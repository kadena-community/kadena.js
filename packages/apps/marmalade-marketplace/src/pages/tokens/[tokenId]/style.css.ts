import {globalStyle,  style } from '@vanilla-extract/css';
import { tokens, token } from '@kadena/kode-ui/styles';

export const container = style({
  margin: '160px 15% 0',
  backgroundColor: token('color.background.layer.default'),
  borderRadius: token('radius.sm'),
  border: `1px solid ${token('color.border.base.subtle')}`,
  gap: '64px',
});

export const secondContainer = style({
  margin: '50px 15% 0',
  backgroundColor: token('color.background.base.default'),
});

export const shareContainer = style({
  display: 'flex',
  margin: `${token('spacing.n4')} 0% 0`,
  width: '101%',
  height: '38px',
  gap: token('spacing.n4'),
  justifyContent: 'space-between',
});

export const formContainer = style({
  marginTop: '25px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: token('spacing.n4'),
  width: '100%'
});

export const buttonRowContainer = style({
  margin: `${token('spacing.n6')} 15% 0`,
  justifyContent: 'space-between',
});

export const tokenImageClass = style({
  width: '100%',
  height: '100%',
  minHeight: '336px',
  minWidth: '336px',
  objectFit: 'cover',
  borderRadius: token('radius.lg'),
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
  gap: token('spacing.n4'),
});

export const tabContainer = style({
  display: 'flex',
  gap:  token('spacing.n2'),
  border: `1px solid ${token('color.border.base.subtle')}`,
  borderTop: 'none',
  borderRadius: token('radius.sm'),
  backgroundColor: token('color.background.layer.default'),
});

export const flexContainer = style({
  display: 'flex',
  width: '100%',
  padding: '16px 32px',
  borderRadius: token('radius.sm'),
  justifyContent: 'space-between',
  gap:  token('spacing.n3'),
});

export const flexItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap:  token('spacing.n2'),
  flex: '1',
})

export const checkboxColumn = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: token('spacing.n2'),
  marginTop: token('spacing.n2'),
  justifyContent: 'space-evenly',
  height: '100%'
});

export const configContainer = style({
  display: "flex", 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  height: '100px'
})

export const labelTitle = style({
  paddingTop: token('spacing.n2'),
  paddingBottom: token('spacing.n2'),
  gap: token('spacing.n2')
});
