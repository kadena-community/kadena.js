import { atoms } from '@theme/atoms.css';
import { style } from '@vanilla-extract/css';

export const headerClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
    marginBlock: 'sm',
  }),
]);

export const infoClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'xxs',
    fontSize: 'xs',
    marginInlineStart: 'auto',
    color: 'text.base.default',
  }),
]);

export const tagClass = style([
  atoms({
    backgroundColor: 'layer-3.inverse.default',
    color: 'text.base.inverse.default',
    borderRadius: 'sm',
    paddingInline: 'sm',
    fontSize: 'xs',
    fontWeight: 'bodyFont.bold',
    display: 'inline-block',
  }),
  {
    paddingTop: '0.05rem',
    paddingBottom: '0.05rem',
  },
]);
