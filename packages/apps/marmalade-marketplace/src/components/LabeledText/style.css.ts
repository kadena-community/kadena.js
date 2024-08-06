import { style, globalStyle } from '@vanilla-extract/css';
import { tokens } from '@kadena/kode-ui/styles';

export const labelValueContainer = style({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',
});

export const labelTitle = style({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '1rem',
});

export const labelValue = style({
  display: 'inline-block',
  marginTop: '0.5rem',
  marginLeft: '1rem',
});

