import { style } from '@kadena/kode-ui';
import { atoms, globalStyle, token } from '@kadena/kode-ui/styles';

export const signOptionsRadioWrapperClass = style({});

globalStyle(`${signOptionsRadioWrapperClass} [class^="Radio"] input`, {
  visibility: 'hidden',
});

export const itemClass = style([
  atoms({
    padding: 'md',
  }),
  {
    backgroundColor: token('color.background.surface.default'),
    selectors: {
      '&:hover': {
        backgroundColor: token('color.border.base.default'),
        cursor: 'pointer',
      },
    },
  },
]);
