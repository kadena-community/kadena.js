import { responsiveStyle, sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const dialogClass = style([
  responsiveStyle({
    xs: {
      height: '100svh',
      width: '100vw',
    },
    md: {
      height: '75vh',
    },
  }),
]);

export const contentClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    overflowY: 'hidden',
    overflowX: 'visible',
  },
]);
