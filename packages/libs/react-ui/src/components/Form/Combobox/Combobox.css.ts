import { style } from '@vanilla-extract/css';
import { atoms, bodyBaseRegular, token } from '../../../styles';
import { buttonReset } from '../../Button/Button.css';

export const comboBoxControlClass = style([
  bodyBaseRegular,
  atoms({
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'sm',
    backgroundColor: 'input.default',
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
      '&[data-positive]': {
        outline: `2px solid ${token('color.border.semantic.positive.@focus')}`,
      },
      '&[data-disabled]': {
        pointerEvents: 'none',
        backgroundColor: token('color.background.input.inverse.default'),
        color: token('color.text.base.inverse.@disabled'),
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
export const comboBoxInputClass = style([
  atoms({
    fontSize: 'base',
    flex: 1,
    height: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    margin: 'no',
    padding: 'no',
    color: 'inherit',
    outline: 'none',
  }),
  {
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
  },
]);

export const comboBoxButtonClass = style([
  buttonReset,
  atoms({
    background: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    cursor: 'pointer',
    padding: 'no',
  }),
]);
