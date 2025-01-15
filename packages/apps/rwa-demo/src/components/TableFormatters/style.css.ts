import { recipe } from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';

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
