import { atoms } from '@theme/atoms.css';
import { style } from '@vanilla-extract/css';

export const labelClass = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
    fontWeight: 'bodyFont.bold',
    textTransform: 'capitalize',
  }),
]);

export const headerClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
    marginY: 'sm',
  }),
]);

export const infoClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'xxs',
    fontSize: 'xs',
    marginLeft: 'auto',
    color: 'text.base.default',
  }),
]);

export const tagClass = style([
  atoms({
    backgroundColor: 'layer-3.inverse.default',
    color: 'text.base.inverse.default',
    borderRadius: 'sm',
    paddingX: 'sm',
    fontSize: 'xs',
    fontWeight: 'bodyFont.bold',
    display: 'inline-block',
  }),
  {
    paddingTop: '0.05rem',
    paddingBottom: '0.05rem',
  },
]);
