import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../../styles';

export const headerClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
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
    backgroundColor: 'base.inverse.default',
    color: 'text.base.inverse.default',
    borderRadius: 'sm',
    paddingInline: 'sm',
    fontSize: 'xs',
    fontWeight: 'secondaryFont.bold',
    display: 'inline-block',
  }),
  {
    paddingTop: '0.05rem',
    paddingBottom: '0.05rem',
  },
]);

export const labelClass = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
    fontWeight: 'secondaryFont.bold',
  }),
]);

export const disabledLabelClass = style([
  atoms({
    fontSize: 'sm',
    pointerEvents: 'none',
    fontWeight: 'secondaryFont.bold',
  }),
  {
    color: token('color.text.base.@disabled'),
  },
]);
