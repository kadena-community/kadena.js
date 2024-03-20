import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { atoms, token } from '../../styles';

export type FormFieldStatus = 'disabled' | 'positive' | 'warning' | 'negative';
export const statusColor = createVar();
export const statusOutlineColor = createVar();

export const baseOutlinedClass = style([
  {
    outline: `2px solid ${fallbackVar(
      statusOutlineColor,
      token('color.border.base.default'),
    )}`,
  },
]);

export const baseContainerClass = style([
  atoms({
    alignItems: 'stretch',
    borderRadius: 'sm',
    display: 'flex',
    color: 'text.base.default',
    overflow: 'hidden',
    lineHeight: 'base',
    backgroundColor: 'layer10.default',
    position: 'relative',
  }),
  {
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    outlineOffset: '2px',
    selectors: {
      '&:focus-within': {
        outline: `2px solid ${fallbackVar(
          statusColor,
          token('color.border.semantic.info.@focus'),
        )}`,
        outlineOffset: '2px',
      },
    },
  },
]);

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
});

export const inputContainer = atoms({
  display: 'flex',
  flex: 1,
  position: 'relative',
  alignItems: 'stretch',
});

// Field shared css

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
    backgroundColor: 'layer10.default',
    border: 'none',
    color: 'text.base.default',
    outline: 'none',
    flex: 1,
    overflow: 'hidden',
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
      '&[data-outlined]': {
        border: `2px solid ${token('color.border.base.default')}`,
      },
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
