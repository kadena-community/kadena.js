import { atoms } from '@theme/atoms.css';
import { style } from '@vanilla-extract/css';

export const listBoxClass = style([
  atoms({ backgroundColor: 'layer-3.default', borderRadius: 'sm' }),
]);

export const optionClass = style([
  atoms({
    color: 'text.base.default',
    padding: 'sm',
  }),
  { cursor: 'pointer' },
]);

export const selectedClass = style([
  atoms({
    color: 'text.base.@selected',
  }),
]);
export const focusedClass = style([
  atoms({
    backgroundColor: 'layer-3.inverse.default',
    color: 'text.base.inverse.default',
  }),
]);
export const disabledClass = style([
  atoms({
    // backgroundColor: 'base.@disabled',
    // color: 'text.base.@disabled',
  }),
]);
