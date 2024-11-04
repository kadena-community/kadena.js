import { cardColor, cardHoverColor } from '@/utils/color.ts';
import { atoms, tokens, vars } from '@kadena/kode-ui/styles';
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

export const noStyleLinkClass = style({
  textDecoration: 'none',
  color: 'inherit',
});

export const chainClass = style([
  {
    background: vars.colors.$layoutSurfaceCard,
  },
]);

export const noStyleButtonClass = style({
  background: 'none',
  color: 'inherit',
  border: 'none',
  padding: 0,
  font: 'inherit',
  outline: 'inherit',
  cursor: 'pointer',
  width: '100%',
});

export const accountTypeClass = style([
  atoms({
    paddingInline: 'sm',
    marginBlockStart: 'xs',
    textDecoration: 'none',
  }),
  {
    cursor: 'pointer',
    border: 'none',
    // background: tokens.kda.foundation.color.background.surface.default,
    selectors: {
      '&:hover': {
        outline: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
        background: tokens.kda.foundation.color.background.surface.default,
      },
      '&.selected': {
        cursor: 'default',
        outline: `solid 1px ${tokens.kda.foundation.color.border.base.default}`,
        background: tokens.kda.foundation.color.background.surface.default,
      },
    },
  },
]);
