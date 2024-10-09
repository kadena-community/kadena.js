import {
  atoms,
  globalStyle,
  responsiveStyle,
  token,
  tokens,
} from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const cardVisualClass = style({
  width: tokens.kda.foundation.size.n16,
  height: tokens.kda.foundation.size.n16,
  color: token('color.icon.brand.primary.default'),
});

export const selectorClassWrapper = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'xs',
    borderStyle: 'solid',
    paddingInlineStart: 'no',
    borderColor: 'base.subtle',
  }),
  { paddingInlineEnd: '1px', borderWidth: 0, direction: 'rtl' },
  responsiveStyle({
    md: {
      paddingInlineStart: token('spacing.md'),
      borderWidth: token('border.hairline'),
    },
  }),
]);

export const selectorClass = style([
  {
    display: 'flex',
    alignItems: 'center',
    height: '46px',
    paddingInlineEnd: token('spacing.md'),
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: token('color.border.base.subtle'),
    borderInlineEndWidth: token('border.hairline'),
  },
]);

export const selectorButtonClass = style({
  height: '46px',
  aspectRatio: '1/1',
});
