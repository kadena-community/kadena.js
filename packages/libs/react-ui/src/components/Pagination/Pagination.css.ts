import { style, token } from '../../styles';

export const listClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: token('spacing.xs'),
  padding: 0,
  listStyleType: 'none',
});

export const pageNumButtonClass = style({
  paddingBlock: `${token('spacing.xs')} !important`,
  selectors: {
    '&[data-current]': {
      outline: `2px auto ${token('color.accent.brand.primary')} !important`,
    },
  },
});
