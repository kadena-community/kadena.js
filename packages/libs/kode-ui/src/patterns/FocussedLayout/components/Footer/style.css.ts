import {
  globalStyle,
  responsiveStyle,
  style,
  token,
} from './../../../../styles';

export const footerClass = style({
  marginBlockStart: '-28px',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  ...responsiveStyle({
    xs: {
      flexDirection: 'column',
    },
    md: {
      flexDirection: 'row',
    },
  }),
});

export const footerContentClass = style({
  ...responsiveStyle({
    xs: {
      flexDirection: 'column',
      gap: token('spacing.xs'),
    },
    sm: {
      flexDirection: 'row',
      gap: token('spacing.md'),
    },
  }),
});

globalStyle(`${footerClass} *`, {
  color: `${token('color.text.gray.default')} !important`,
  fontSize: `${token('typography.fontSize.xs')} !important`,
});

globalStyle(`${footerClass} div a`, {
  color: token('color.text.gray.default'),
  textDecoration: 'none',
});

globalStyle(`${footerClass} div a:hover`, {
  textDecoration: 'underline',
});
