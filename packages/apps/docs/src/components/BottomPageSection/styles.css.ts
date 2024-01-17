import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  atoms({
    width: '100%',
  }),
  {
    marginBlockStart: tokens.kda.foundation.size.n40,
  },
]);

export const bottomWrapperCodeLayoutClass = style(
  responsiveStyle({
    xl: {
      width: '56%',
    },
    xxl: {
      width: '60%',
    },
  }),
);

export const navClass = style([
  {
    ...responsiveStyle({
      xs: {
        width: '100%',
      },
      lg: {
        width: '100%',
      },
    }),
  },
]);
