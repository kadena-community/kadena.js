import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/tokens/contract.css';

export const tagItemClass = style([
  {
    selectors: {
      '&[aria-disabled="true"]': {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      '&[data-focus-visible="true"]': {
        outline: `2px auto ${tokens.kda.foundation.color.accent.brand.primary}`,
        outlineOffset: '2px',
      },
      '&[data-focus-visible="false"]': {
        outline: 'none',
      },
    },
  },
]);

export const tagClass = style([
  atoms({
    backgroundColor: 'base.default',
    color: 'text.base.default',
    borderRadius: 'xs',
    paddingBlock: 'xs',
    paddingInline: 'sm',
    display: 'inline-flex',
    alignItems: 'center',
    border: 'hairline',
  }),
]);

export const closeButtonClass = style([
  atoms({
    border: 'none',
    background: 'none',
    padding: 'xs',
    cursor: 'pointer',
    marginInlineStart: 'xs',
    outline: 'none',
  }),
  {
    marginRight: calc(tokens.kda.foundation.spacing.xs).negate().toString(),
  },
]);

export const tagListClass = style([
  atoms({
    display: 'flex',
    gap: 'sm',
    flexWrap: 'wrap',
    flexDirection: 'row',
  }),
]);

export const tagGroupLabelClass = style([
  atoms({
    marginBlockEnd: 'sm',
    display: 'block',
  }),
]);
