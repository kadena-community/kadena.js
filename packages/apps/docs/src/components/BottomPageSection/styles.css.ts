import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  sprinkles({
    width: '100%',
  }),
  {
    marginBlockStart: vars.sizes.$40,
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
