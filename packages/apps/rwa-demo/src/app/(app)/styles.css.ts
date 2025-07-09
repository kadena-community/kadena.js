import { style } from '@kadena/kode-ui';
import { atoms, globalStyle, token } from '@kadena/kode-ui/styles';

export const actionsWrapperClass = style([
  atoms({
    justifyContent: 'flex-start',
    gap: 'sm',
    flexWrap: 'wrap',
  }),
]);

export const logoClass = style({
  color: token('color.text.brand.wordmark.default'),
  height: '32px',
  minHeight: '32px',
});

globalStyle('body', {
  overflowY: 'hidden',
});
