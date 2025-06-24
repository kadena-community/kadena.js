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

export const formatAliasEditClass = style([
  atoms({}),
  {
    textDecoration: 'none',
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
]);

globalStyle(`.accountwrapperclass ${formatAliasEditClass}`, {
  visibility: 'hidden',
  pointerEvents: 'none',
});

globalStyle(`.accountwrapperclass:hover ${formatAliasEditClass}`, {
  visibility: 'visible',
  pointerEvents: 'auto',
});
