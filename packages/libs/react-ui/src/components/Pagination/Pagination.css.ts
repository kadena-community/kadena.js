import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../styles';

export const listClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'xs',
    padding: 'no',
  }),
  { listStyleType: 'none' },
]);

export const pageNumButtonClass = style([
  {
    paddingBlock: `${token('spacing.xs')} !important`,
    selectors: {
      '&[data-current]': {
        outline: `2px auto ${token('color.accent.brand.primary')} !important`,
      },
    },
  },
]);
