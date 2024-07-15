import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const menuClass = style([
  atoms({
    position: 'fixed',
    inset: 0,
    alignItems: 'flex-start',
  }),
  {
    transform: 'translateX(-100%)',
    transition: 'transform .5s ease',
    backgroundColor:
      tokens.kda.foundation.color.background.surfaceHighContrast.default,
    zIndex: tokens.kda.foundation.zIndex.default,
  },
]);

export const menuOpenClass = style([
  {
    transform: 'translateX(0%)',

    ...responsiveStyle({
      md: {
        transform: 'translateX(-100%)',
      },
    }),
  },
]);

export const listClass = style([
  atoms({
    paddingInlineStart: 'md',
  }),
  {
    listStyle: 'none',
  },
]);
