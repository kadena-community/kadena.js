import { atoms } from '@theme/atoms.css';
import { token } from '@theme/themeUtils';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const listBoxClass = style([
  atoms({
    backgroundColor: 'layer-3.default',
    borderRadius: 'sm',
    margin: 'no',
    padding: 'no',
    overflow: 'auto',
  }),
  {
    maxHeight: 150,
    listStyle: 'none',
  },
]);

export const optionClass = style([
  atoms({
    color: 'text.base.default',
    padding: 'sm',
    borderColor: 'brand.primary.subtle',
    borderStyle: 'solid',
    borderWidth: 'hairline',
  }),
  {
    cursor: 'pointer',
    borderBlockStartWidth: 0,
    borderInlineWidth: 0,
  },
]);

export const selectedClass = style([
  atoms({
    color: 'text.base.@selected',
  }),
]);
export const focusedClass = style([
  {
    backgroundColor: vars.colors.$blue20,
  },
]);
export const disabledClass = style([
  {
    backgroundColor: token('color.background.base.@disabled'),
    color: token('color.text.base.@disabled'),
    cursor: 'default',
  },
]);
