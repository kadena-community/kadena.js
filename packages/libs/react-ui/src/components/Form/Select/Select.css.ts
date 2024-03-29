import { style } from '@vanilla-extract/css';
import { atoms, bodyBaseRegular, ellipsis, token } from '../../../styles';

export const selectButtonClass = style([
  bodyBaseRegular,
  atoms({
    display: 'flex',
    alignItems: 'center',
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
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    outlineOffset: '2px',
    selectors: {
      '&[data-hovered]': {
        cursor: 'pointer',
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

// applied on a span
export const selectValueClass = style([
  ellipsis,
  {
    flex: '1',
    textAlign: 'start',
    selectors: {
      "&[data-placeholder='true']": {
        color: token('color.text.subtlest.default'),
      },
    },
  },
]);
