import { style } from '@vanilla-extract/css';
import { tokens, token } from '@kadena/kode-ui/styles';

export const container = style({
  margin: '160px 15% 0',
  backgroundColor: token('color.background.surface.default'),
  borderRadius: token('radius.sm'),
  border: `1px solid ${token('color.border.base.subtle')}`,
});

export const secondContainer = style({
  margin: '50px 15% 0',
  backgroundColor: token('color.background.surface.default'),
  borderRadius: token('radius.sm'),
  border: `1px solid ${token('color.border.base.subtle')}`,
});

export const shareContainer = style({
  display: 'flex',
  margin: `${token('spacing.n4')} 0% 0`,
  gap: token('spacing.n4'),
  
});

export const tabContainer = style({
  backgroundColor: token('color.background.layer.default'),
})

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: token('spacing.n4'),
});

export const buttonRowContainer = style({
  margin: `${token('spacing.n6')} 15% 0`,
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

export const flexContainer = style({
  display: 'flex',
  gap:  token('spacing.n2'),
  borderRadius: token('radius.sm'),
  border: '1 0 0 0',
});

export const flexItem = style({
  flex: '1',
  margin: `0 ${token('spacing.n4')}`,
  gap: token('spacing.n2'),
})

export const checkboxRow = style({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: token('spacing.n2'),
  marginTop: token('spacing.n2'),
});

