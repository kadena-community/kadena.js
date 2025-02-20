import { style, token } from './../../../../styles';

export const logoClass = style({
  color: token('color.text.brand.wordmark.default'),
  height: '32px',
  minHeight: '32px',
});
export const logoMiniClass = style({
  width: '32px',
  minWidth: '32px',
  aspectRatio: '1/1',
  marginInline: token('spacing.sm'),
});
