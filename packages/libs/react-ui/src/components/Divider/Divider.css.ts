import { recipe, token } from '../../styles';

export const dividerClass = recipe({
  base: {
    width: '100%',
    marginBlock: token('spacing.lg'),
    border: 'none',
    height: token('border.width.hairline'),
  },
  variants: {
    variant: {
      subtle: {
        backgroundColor: token('color.border.base.subtle'),
      },
      base: {
        backgroundColor: token('color.border.base.default'),
      },
      bold: {
        backgroundColor: token('color.border.base.bold'),
      },
      boldest: {
        backgroundColor: token('color.border.base.boldest'),
      },
      highContrast: {
        backgroundColor: token('color.border.base.high-contrast'),
      },
    },
  },
});
