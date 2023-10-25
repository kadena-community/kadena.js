import { responsiveStyle, sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  sprinkles({
    marginTop: '$40',
    width: '100%',
  }),
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
