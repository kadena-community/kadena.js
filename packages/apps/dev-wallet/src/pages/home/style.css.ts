import { cardColor, cardHoverColor } from '@/utils/color.ts';
import { atoms, tokens, vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const pageClass = style({
  minHeight: 'calc(100vh - 90px)',
});

export const panelClass = style([
  atoms({
    padding: 'md',
  }),
  {
    background: tokens.kda.foundation.color.background.surface.default,
    textAlign: 'start',
  },
]);

export const listClass = style([
  atoms({
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    listStyleType: 'none',
    marginBlockStart: 'md',
    padding: 'n0',
    gap: 'sm',
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

export const linkClass = style({
  color: vars.colors.$positiveSurface,
  background: 'transparent',
  textAlign: 'left',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  selectors: {
    [`&:hover`]: {
      textDecoration: 'underline',
    },
  },
});
