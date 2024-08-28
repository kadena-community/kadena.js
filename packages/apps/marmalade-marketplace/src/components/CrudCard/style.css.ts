import { style, globalStyle } from '@vanilla-extract/css';
import { token } from '@kadena/kode-ui/styles';

export const card = style({
  padding: '32px',
  gap: '64px',
  color: token('color.text.base.default'),
});

export const titleContainer = style({
  width: '45%',
  paddingRight: '40px',
});

globalStyle(`${titleContainer} svg`, {
  height: '56px',
  color: token('color.icon.brand.primary.default'),
  marginBottom: '8px',
});

globalStyle(`${titleContainer} p`, {
  margin: '16px 0',
});

export const contentContainer = style({
  width: '55%',
});




