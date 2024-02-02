import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../../styles';

export const numberButtonClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'layer-3.default',
    color: 'text.base.default',
    outline: 'none',
  }),
  {
    borderLeft: `1px solid ${token('color.border.base.bold')}`,
    paddingLeft: '8px',
  },
]);

export const iconClass = style([
  atoms({
    color: 'text.base.default',
  }),
]);

export const overwriteVarianClass = style([
  {
    padding: '0',
  },
]);
