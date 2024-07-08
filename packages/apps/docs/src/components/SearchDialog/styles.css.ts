import { atoms, responsiveStyle } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const dialogClass = style([
  atoms({
    backgroundColor: 'base.default',
  }),
  responsiveStyle({
    xs: {
      height: '100svh',
      width: '100vw !important',
    },
    md: {
      height: '75vh',
    },
  }),
]);

export const contentClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    overflowX: 'visible',
  }),
]);
