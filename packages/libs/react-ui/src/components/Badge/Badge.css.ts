import { style } from '@vanilla-extract/css';

import { atoms, token } from '../../styles';

export const initialsClass = style([
  atoms({
    fontSize: '9xl',
    fontWeight: 'bodyFont.bold',
  }),
]);

export const circleClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '9xl',
    fontWeight: 'bodyFont.regular',
    fontFamily: 'primaryFont', // will be updated with latest tokens
    borderRadius: 'round',
    color: 'text.base.inverse.default',
    // backgroundColor: 'layer-2.default',
    overflow: 'visible',
  }),
  {
    width: '150px',
    height: '150px',
    backgroundColor: token('color.background.base.inverse.default'),
    border: `2px solid ${token('color.icon.base.inverse.default')}`,
  },
]);

export const statusClass = style([
  atoms({
    position: 'absolute',
    borderRadius: 'round',
  }),
  {
    width: '40px',
    height: '40px',
    bottom: '20px',
    right: '20px',
    transform: 'translate(50%, 50%)',
    backgroundColor: token('color.accent.brand.primary'),
  },
]);
