import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/tokens/contract.css';
import { style } from '@vanilla-extract/css';

export const disabledClass = style([
  atoms({
    pointerEvents: 'none',
    backgroundColor: 'layer-3.default',
  }),
]);

export const textAreaContainerClass = style([
  atoms({
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: 'xs',
    lineHeight: 'lg',
    paddingInlineStart: 'sm',
    paddingInlineEnd: 'xs',
  }),
]);

export const textAreaClass = style([
  atoms({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: 'text.base.default',
    outline: 'none',
    flexGrow: 1,
    paddingBlock: 'sm',
    fontSize: 'base',
  }),
  {
    minHeight: tokens.kda.foundation.size.n20,
    resize: 'none',
    '::placeholder': {
      color: tokens.kda.foundation.color.text.subtlest.default,
    },
  },
]);

export const buttonContainerClass = style([
  atoms({
    position: 'relative',
  }),
  {
    top: '4px',
  },
]);
