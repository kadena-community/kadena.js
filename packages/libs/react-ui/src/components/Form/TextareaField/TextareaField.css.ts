import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../../styles';

export const addon = style({
  position: 'absolute',
  insetBlockStart: token('spacing.sm'),
  insetInlineEnd: token('spacing.sm'),
});

export const textarea = style([
  atoms({
    borderRadius: 'sm',
    backgroundColor: 'input.default',
    border: 'none',
    color: 'text.base.default',
    outline: 'none',
    flex: 1,
    overflow: 'hidden',
  }),
  {
    paddingInline: token('spacing.md'),
    paddingBlock: token('spacing.sm'),
    minHeight: token('size.n20'),
    resize: 'none',
    '::placeholder': {
      color: token('color.text.subtlest.default'),
    },
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    outlineOffset: '2px',
    selectors: {
      '&[data-outlined]': {
        border: `2px solid ${token('color.border.base.default')}`,
      },
      [`&:has(~ ${addon})`]: {
        paddingInlineEnd: `calc(var(--end-addon-width) + ${token(
          'spacing.lg',
        )})`,
      },
      '&[data-positive]': {
        outline: `2px solid ${token('color.border.semantic.positive.@focus')}`,
      },
      '&[data-disabled]': {
        pointerEvents: 'none',
        backgroundColor: token('color.background.layer.default'),
      },
      '&[data-focused]': {
        outline: `2px solid ${token('color.border.semantic.info.@focus')}`,
      },
      '&[data-invalid]': {
        outline: `2px solid ${token('color.border.semantic.negative.@focus')}`,
      },
    },
  },
]);
