import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/index';
import { style } from '@vanilla-extract/css';
import { baseContainerClass } from '../Form.css';

export const containerClass = style([
  baseContainerClass,
  atoms({
    backgroundColor: 'layer-3.default',
    gap: 'sm',
    paddingInline: 'md',
  }),
]);

export const containerClassDisabled = style([
  atoms({
    pointerEvents: 'none',
    color: 'text.base.inverse.default',
    backgroundColor: 'layer-3.inverse.default',
  }),
]);

export const iconClass = style([
  atoms({
    alignItems: 'center',
    display: 'flex',
  }),
]);

export const selectClass = style([
  atoms({
    background: 'none',
    border: 'none',
    color: 'text.base.default',
    flexGrow: 1,
    outline: 'none',
    paddingInlineEnd: 'lg',
    paddingBlock: 'sm',
    fontSize: 'base',
  }),
  {
    backgroundColor: 'inherit',
    color: 'inherit',
    appearance: 'none',
  },
]);

export const chevronIconClass = style([
  atoms({
    display: 'inline-flex',
    alignItems: 'center',
    marginInlineEnd: 'sm',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    color: 'icon.base.default',
  }),
  {
    pointerEvents: 'none',
    zIndex: 10,
    selectors: {
      '&:active': {
        color: tokens.kda.foundation.color.icon.base.default,
      },
    },
  },
]);
