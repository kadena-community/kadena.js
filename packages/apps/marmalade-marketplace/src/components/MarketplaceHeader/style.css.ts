import { responsiveStyle, token } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const navHeader = style({
  backgroundColor: token('color.background.layer.default'),
});

export const navHeaderLink = style({
  fontSize: 'clamp(12px, 1.1vw, 16px)',
});

export const accountButtonWrapperClass = style({});

globalStyle(
  `${accountButtonWrapperClass} button`,
  responsiveStyle({
    lg: {
      borderEndStartRadius: 0,
      borderStartStartRadius: 0,
    },
  }),
);
