import { sprinkles, vars } from '../../../styles';
import { statusColor } from '../InputWrapper/InputWrapper.css';

import { fallbackVar, style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    display: 'flex',
    overflow: 'hidden',
    paddingY: '$2',
    bg: '$background',
    color: '$foreground',
    borderRadius: '$sm',
  }),
  {
    borderBottom: `1px solid ${fallbackVar(
      statusColor,
      vars.colors.$neutral3,
    )}`,
  },
]);

export const inputContainerClass = style([
  sprinkles({
    alignItems: 'center',
    lineHeight: '$lg',
    display: 'flex',
    paddingX: '$4',
    gap: '$2',
    flexGrow: 1,
  }),
]);

export const inputClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$foreground',
    outline: 'none',
    flexGrow: 1,
  }),
  {
    '::placeholder': {
      color: vars.colors.$neutral3,
    },
  },
]);

export const leadingTextClass = style([
  sprinkles({
    backgroundColor: '$neutral2',
    display: 'flex',
    alignItems: 'center',
    paddingX: '$4',
  }),
]);

export const outlinedClass = style([
  sprinkles({
    borderRadius: '$sm',
  }),
  {
    border: `1px solid ${vars.colors.$neutral3}`,
  },
]);
