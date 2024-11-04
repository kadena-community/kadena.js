import { token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const labelValueContainer = style({
  paddingBottom: '8px',
  gap: token('spacing.n2'),
});

export const labelTitle = style({
  gap: token('spacing.n2'),
});

export const labelValue = style({
  display: 'inline-block',
  marginTop: '0.5rem',
});
