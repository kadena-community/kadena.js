import { atoms, tokens } from '@kadena/react-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const asideItemLinkClass = style([
  atoms({
    textDecoration: 'none',
    fontSize: 'sm',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const asideItemLinkActiveVariants = styleVariants({
  true: {
    color: tokens.kda.foundation.color.text.base.default,
  },
  false: {
    color: tokens.kda.foundation.color.text.base.default,
    opacity: 0.6,
  },
});

export const asideItemClass = style([
  atoms({
    paddingBlock: 'xs',
  }),
  {
    selectors: {
      '&::marker': {
        color: tokens.kda.foundation.color.brand.primary.n60,
        fontWeight: tokens.kda.foundation.typography.weight.secondaryFont.bold,
        display: 'inline-block',
        width: tokens.kda.foundation.spacing.md,
        margin: `0 ${tokens.kda.foundation.spacing.xs}`,
      },
    },
  },
]);

export const asideListClass = style([
  atoms({
    margin: 'no',
    padding: 'no',
  }),
  {
    listStyle: 'initial',
    listStylePosition: 'outside',
  },
]);

export const asideListInnerVariants = styleVariants({
  true: {
    paddingInlineStart: tokens.kda.foundation.spacing.lg,
  },
  false: {},
});
