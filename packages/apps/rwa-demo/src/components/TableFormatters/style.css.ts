import { recipe, style } from '@kadena/kode-ui';
import { atoms, token } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

export const formatAmountClass = recipe({
  base: {},
  variants: {
    amount: {
      positive: {
        color: token('color.icon.semantic.positive.default'),
      },
      negative: {
        color: token('color.icon.semantic.negative.default'),
      },
    },
  },
});

export const formatAliasWrapperClass = style({});
export const formatAliasEditClass = style([
  atoms({}),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
]);

globalStyle(`${formatAliasWrapperClass} > a`, {
  visibility: 'hidden',
  pointerEvents: 'none',
});

globalStyle(`${formatAliasWrapperClass}:hover > a`, {
  visibility: 'visible',
  pointerEvents: 'auto',
});
