import { style } from '@vanilla-extract/css';

import { recipe } from '@vanilla-extract/recipes';
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

export const circle = recipe({
  base: [
    atoms({
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bodyFont.regular',
      fontFamily: 'primaryFont', // will be updated with latest tokens
      borderRadius: 'round',
      color: 'text.base.inverse.default',
      overflow: 'visible',
    }),
    {
      width: '150px',
      height: '150px',
      backgroundColor: token('color.background.base.inverse.default'),
      border: `2px solid ${token('color.icon.base.inverse.default')}`,
    },
  ],
  variants: {
    size: {
      xs: {
        fontSize: token('typography.fontSize.6xl'),
        width: '100px',
        height: '100px',
      },
      s: {
        fontSize: token('typography.fontSize.9xl'), // looks same in the design
        width: '130px',
        height: '130px',
      },
      base: {
        fontSize: token('typography.fontSize.9xl'),
        width: '150px',
        height: '150px',
      },
    },
  },
  defaultVariants: {
    size: 'base',
  },
});

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

export const status = recipe({
  base: [
    atoms({
      position: 'absolute',
      borderRadius: 'round',
    }),
    {
      transform: 'translate(50%, 50%)',
    },
  ],
  variants: {
    color: {
      primary: {
        background: token('color.accent.brand.primary'),
      },
      test: {
        background: 'red',
      },
    },
    size: {
      xs: {
        width: '25px',
        height: '25px',
        bottom: '12px',
        right: '12px',
      },
      s: {
        width: '30px',
        height: '30px',
        bottom: '15px',
        right: '15px',
      },
      base: {
        width: '40px',
        height: '40px',
        bottom: '20px',
        right: '20px',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'base',
  },
});
