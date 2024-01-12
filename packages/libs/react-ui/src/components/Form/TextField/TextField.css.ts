import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../../styles';

export const startAddon = style({
  position: 'absolute',
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  insetInlineStart: token('spacing.sm'),
});

export const endAddon = style({
  position: 'absolute',
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  insetInlineEnd: token('spacing.sm'),
});

export const input = style([
  atoms({
    borderRadius: 'sm',
    backgroundColor: 'layer-3.default',
    border: 'none',
    color: 'text.base.default',
    outline: 'none',
    flex: 1,
    fontSize: 'base',
    overflow: 'hidden',
    lineHeight: 'lg',
  }),
  {
    paddingInlineStart: token('spacing.md'),
    paddingInlineEnd: token('spacing.md'),
    paddingBlock: token('spacing.sm'),
    '::placeholder': {
      color: token('color.text.subtlest.default'),
    },
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    outlineOffset: '2px',
    selectors: {
      '&[data-has-end-addon]': {
        paddingInlineEnd: `calc(var(--end-addon-width) + ${token(
          'spacing.lg',
        )})`,
      },
      '&[data-has-start-addon]': {
        paddingInlineStart: `calc(var(--start-addon-width) + ${token(
          'spacing.lg',
        )})`,
      },
      '&[data-positive]': {
        outline: `2px solid ${token('color.border.semantic.positive.@focus')}`,
      },
      '&[data-disabled]': {
        pointerEvents: 'none',
        backgroundColor: token('color.background.base.@disabled'),
        color: token('color.text.base.@disabled'),
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
