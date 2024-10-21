import { cardColor, cardHoverColor } from '@/utils/color.ts';
import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const pageClass = style({
  minHeight: 'calc(100vh - 90px)',
});

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
    padding: 'md',
    marginBlockStart: 'xs',
  }),
  {
    background: cardColor,
    selectors: {
      '&:hover': {
        background: cardHoverColor,
      },
    },
  },
]);
