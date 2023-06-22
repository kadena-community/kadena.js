import { sprinkles, vars } from '../../../styles';
import { statusColor } from '../InputWrapper/InputWrapper.css';

import { fallbackVar, style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    height: '$10',
    alignItems: 'stretch',
    display: 'flex',
    overflow: 'hidden',
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
    bg: '$background',
    color: '$foreground',
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
