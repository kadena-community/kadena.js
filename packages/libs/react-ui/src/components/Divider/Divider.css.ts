import { recipe } from '@vanilla-extract/recipes';
import { token } from '../../styles';
import { atoms } from '../../styles/atoms.css';

export const dividerClass = recipe({
  base: [
    atoms({
      width: '100%',
      marginBlock: 'lg',
      border: 'none',
    }),
    {
      height: token('border.width.hairline'),
    },
  ],
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
        boldest: {
          backgroundColor: token('color.border.base.boldest'),
        },
        highContrast: {
          backgroundColor: token('color.border.base.high-contrast'),
        },
      },
    },
  },
});
