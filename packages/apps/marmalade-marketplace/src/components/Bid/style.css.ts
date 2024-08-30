import { style } from '@vanilla-extract/css';
import { tokens, token } from '@kadena/kode-ui/styles';

export const tokenDetailsInnerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: token('spacing.n1'),
  marginBottom: '8px',
  width: '100%'
});

export const labelTitle = style({
  gap: token('spacing.n2'),
  paddingBottom: token('spacing.n2'),
});