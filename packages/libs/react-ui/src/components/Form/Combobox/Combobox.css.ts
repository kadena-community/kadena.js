import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../../styles';
import { buttonReset } from '../../Button/SharedButton.css';

export const comboBoxControlClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
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
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    outlineOffset: '2px',
    selectors: {
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
export const comboBoxInputClass = style({
  flex: 1,
  height: '100%',
  border: 'none',
  background: 'transparent',
  padding: 0,
  margin: 0,
  outline: 'none',
  color: 'inherit',
  '::-webkit-search-cancel-button': {
    appearance: 'none',
  },
  '::placeholder': {
    color: token('color.text.subtlest.default'),
  },
  selectors: {
    "&[data-disabled='true']": {
      color: token('color.text.base.@disabled'),
    },
  },
});

export const comboBoxButtonClass = style([
  buttonReset,
  style({
    background: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }),
]);
