import { cardHoverColor } from '@/utils/color.ts';
import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  atoms({
    listStyleType: 'none',
    marginBlockStart: 'md',
    padding: 'n0',
  }),
]);

export const chainListClass = style([
  atoms({
    listStyleType: 'none',
    paddingBlock: 'n1',
  }),
]);

export const listItemClass = style([
  atoms({
    padding: 'sm',
    paddingInline: 'md',
    marginBlockStart: 'xs',
    textDecoration: 'none',
  }),
  {
    border: 'none',
    flex: 1,
    minHeight: '50px',
    background: tokens.kda.foundation.color.background.surface.default,
    selectors: {
      '&:hover': {
        background: cardHoverColor,
      },
    },
  },
]);
