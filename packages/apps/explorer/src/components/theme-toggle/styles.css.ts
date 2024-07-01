import { responsiveStyle } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const socialsClass = style([
  responsiveStyle({
    xs: { display: 'none' },
    xl: { display: 'flex' },
  }),
]);

export const baseIcon = style([
  {
    transition: '400ms transform ease',
  },
]);

export const reversedIcon = style([
  {
    transform: 'rotate(180deg)',
  },
]);
