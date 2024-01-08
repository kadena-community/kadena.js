import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/tokens/contract.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const disabledClass = style([
  atoms({
    pointerEvents: 'none',
    backgroundColor: 'layer-3.default',
  }),
]);

export const inputContainerClass = style([
  atoms({
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: 'xs',
    lineHeight: 'lg',
    paddingInlineStart: 'sm',
    paddingInlineEnd: 'xs',
  }),
]);

export const inputClass = style([
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
    '::placeholder': {
      color: tokens.kda.foundation.color.text.subtlest.default,
    },
  },
]);

export const leadingTextClass = style([
  atoms({
    overflow: 'hidden',
    display: 'inline-block',
    alignItems: 'center',
    paddingInline: 'sm',
    whiteSpace: 'nowrap',
  }),
  {
    textOverflow: 'ellipsis',
  },
]);

export const leadingTextWrapperClass = style([
  atoms({
    backgroundColor: 'base.default',
    display: 'flex',
    alignItems: 'center',
  }),
]);

export const inputChildrenClass = style([
  atoms({
    padding: 'xxs',
  }),
  {
    marginRight: calc(tokens.kda.foundation.spacing.xs).negate().toString(),
  },
]);

export const leadingTextWidthVariant = styleVariants(vars.sizes, (size) => {
  return {
    width: size,
  };
});
