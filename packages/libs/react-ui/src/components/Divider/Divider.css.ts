import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/index';

export const dividerClass = recipe({
  base: [
    atoms({
      width: '100%',
      marginBlock: 'lg',
      border: 'none',
    }),
    {
      height: tokens.kda.foundation.border.width.hairline,
    },
  ],
  variants: {
    variant: {
      subtle: {
        backgroundColor: tokens.kda.foundation.color.border.base.subtle,
      },
      base: {
        backgroundColor: tokens.kda.foundation.color.border.base.default,
      },
      bold: { backgroundColor: tokens.kda.foundation.color.border.base.bold },
      boldest: {
        backgroundColor: tokens.kda.foundation.color.border.base.boldest,
      },
      highContrast: {
        backgroundColor:
          tokens.kda.foundation.color.border.base['high-contrast'],
      },
    },
  },
});
