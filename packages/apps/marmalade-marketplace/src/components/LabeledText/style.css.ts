import { style, globalStyle } from '@vanilla-extract/css';
import { tokens, token } from '@kadena/kode-ui/styles';

export const labelValueContainer = style({
  paddingBottom: '8px',
  gap: token('spacing.n2')
});

export const labelTitle = style({
  gap: token('spacing.n2')
});

export const labelValue = style({
  display: 'inline-block',
  marginTop: '0.5rem',
});

