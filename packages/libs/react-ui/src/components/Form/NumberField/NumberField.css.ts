import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../../styles';

export const buttonContainerClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'input.default',
    color: 'text.base.default',
    outline: 'none',
  }),
  {
    borderLeft: `1px solid ${token('color.border.base.bold')}`,
    position: 'absolute',
    borderRadius: `0 ${token('spacing.xs')} ${token('spacing.xs')} 0`,
    right: 0,
  },
]);

export const iconClass = style([
  atoms({
    color: 'text.base.default',
  }),
]);

export const buttonClass = style([
  {
    padding: '1px 0',
  },
]);
