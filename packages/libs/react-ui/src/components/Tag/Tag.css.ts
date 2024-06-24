import { calc } from '@vanilla-extract/css-utils';
import { style, token } from '../../styles';

export const tagItemClass = style({
  selectors: {
    '&[aria-disabled="true"]': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    '&[data-focus-visible="true"]': {
      outline: `2px auto ${token('color.accent.brand.primary')}`,
      outlineOffset: '2px',
    },
    '&[data-focus-visible="false"]': {
      outline: 'none',
    },
  },
});

export const tagClass = style({
  backgroundColor: token('color.background.base.default'),
  color: token('color.text.base.default'),
  borderRadius: token('spacing.xs'),
  paddingBlock: token('spacing.xs'),
  paddingInline: token('spacing.sm'),
  display: 'inline-flex',
  alignItems: 'center',
  border: token('border.hairline'),
});

export const closeButtonClass = style({
  border: 'none',
  background: 'none',
  padding: token('spacing.xs'),
  cursor: 'pointer',
  marginInlineStart: token('spacing.xs'),
  outline: 'none',
  marginRight: calc(token('spacing.xs')).negate().toString(),
});

export const tagListClass = style({
  display: 'flex',
  gap: token('spacing.sm'),
  flexWrap: 'wrap',
  flexDirection: 'row',
});

export const tagGroupLabelClass = style({
  marginBlockEnd: token('spacing.sm'),
  display: 'block',
});
