import { style, token } from '@kadena/kode-ui/styles';

export const cardWrapperClass = style([
  {
    minHeight: '400px',
  },
]);

export const logoClass = style({
  color: token('color.text.brand.wordmark.default'),
  height: '32px',
  minHeight: '32px',
});
