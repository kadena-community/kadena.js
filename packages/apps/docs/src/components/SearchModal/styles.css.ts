import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  sprinkles({
    width: '100%',
  }),

  {
    ...responsiveStyle({
      xs: {
        height: '100svh',
        width: `calc(100vw - 100px)`,
      },
      md: {
        width: `calc(${vars.contentWidth.$maxContentWidth} - 100px)`,
        minHeight: '60vh',
      },
    }),
  },
]);
